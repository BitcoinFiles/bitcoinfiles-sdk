import * as filepay from 'filepay';
import axios from 'axios';
import { FileData } from './models/file-data.interface';
declare var Buffer: any;
import * as textEncoder from 'text-encoder';
import { Utils } from './utils';
import * as FormData from 'form-data';
import * as rp from 'request-promise';
import { url } from 'inspector';
const defaultOptions = {
    api_key: '',
    api_base: 'https://api.bitcoinfiles.org',
    media_base: 'https://media.bitcoinfiles.org',
    stream_base: 'https://stream.bitcoinfiles.org',
}

/**
 * Client provides abilities to create and get bitcoinfiles
 */
export class Client {
    options = defaultOptions;
    constructor(optionsOver?: any) {

        if (optionsOver) {
            this.options = Object.assign({}, this.options, optionsOver);
        }
    }
    // Populate api reqest header if it's set
    getHeaders(): any {
        if (this.options.api_key && this.options.api_key !== '') {
            return {
                api_key: this.options.api_key
            };
        }
        return {};
    }

    /**
     * Resolve a promise and/or invoke a callback
     * @param resolveOrReject Resolve or reject function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    private callbackAndResolve(resolveOrReject: Function, data: any, callback?: Function) {
        if (callback) {
            callback(data);
        }
        if (resolveOrReject) {
            return resolveOrReject(data)
        }
    }
    private hexEncode(str: string): string {
        function buf2hex(buffer: any): any {
          const hexStr = Array.prototype.map.call(new Uint8Array(buffer), (x: any) => ('00' + x.toString(16)).slice(-2)).join('');
          return hexStr.toLowerCase();
        }
        const checkHexPrefixRegex = /^0x(.*)/i;
        const match = checkHexPrefixRegex.exec(str);
        if (match) {
            return str;
        } else {
            let enc = new textEncoder.TextEncoder().encode(str);
            return buf2hex(enc)
        }
    }

    private isUtf8(encoding: string): boolean {
        if (!encoding || /\s*/i.test(encoding)) {
            return true;
        }
        return /utf\-?8$/i.test(encoding);
    }

    /**
     *
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    async create(request: { file: FileData, pay: { key: string }, signatures: Array<{ key: string, indexes?: number[]}> }, callback?: Function): Promise<any> {
        if (!request.pay || !request.pay.key || request.pay.key === '') {
            return new Promise((resolve) => {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'key required'
                }, callback);
            });
        }

        const buildResult = await this.buildFile(request);
        if (!buildResult.success) {
            return new Promise((resolve) => {
                this.callbackAndResolve(resolve, {
                    success: false,
                    message: buildResult.message
                }, callback);
            });
        }
        const newArgs: string[] = [];
        for (const i of buildResult.data) {
            const checkHexPrefixRegex = /^0x(.*)/i;
            const match = checkHexPrefixRegex.exec(i);
            if (match && match[1]) {
                newArgs.push(i);
            } else {
                newArgs.push('0x' + i);
            }
        }
        return this.filepay({
            data: newArgs,
            pay: request.pay,
        }, (o) => {
            callback ? callback(o) : null
        });
    }

    /**
     * Pay for queued files to be converted to transactions and broadcast
     *
     * @param rawtx Rawtx that pays for queueFile(s)
     * @param callback optional callback
     */
    async payQueuedFiles(rawtx: string, callback?: Function): Promise<any> {
        const maxBytes = 10000000;
        return new Promise((resolve, reject) => {
            const opts = {
                headers: {},
                maxContentLength: maxBytes,
            }
            opts['maxBodyLength'] = maxBytes;
            const url = `${this.options.api_base}/pay`;
            axios.post(url,
            {
                rawtx: rawtx
            },
            opts,
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    /**
     * Queue a request to cache the file on BitcoinFiles.org and settle on BSV blockchain after payment is received.
     * The response contains a 'payment_sats_needed' field and an 'payment_address` that can be used to pay for queuing into a tx.
     * @param request
     * @param callback
     */
    async queueFile(request: { file: FileData, session_tag?: string}, callback?: Function): Promise<any> {
        const maxBytes = 10000000;
        return new Promise((resolve, reject) => {
            const formData = new FormData({ maxDataSize: maxBytes });
            const opts = {
                headers: {'Content-Type': 'multipart/form-data'},
                maxContentLength: maxBytes,
            }
            opts['maxBodyLength'] = maxBytes;
            formData.append("file", Buffer.from(request.file.content, request.file.encoding ? request.file.encoding : 'hex'));
            const url = `${this.options.api_base}/upload` + (request.session_tag ? `?tag=${request.session_tag}` : '');
            const options = {
                method: 'POST',
                uri: url,
                formData: {
                    // Like <input type="file" name="file">
                    file: {
                        value: Buffer.from(request.file.content, request.file.encoding),
                        options: {
                            filename: request.file.name ? request.file.name : (new Date().getTime()) + '',
                            contentType: request.file.contentType
                        }
                    }
                },
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };

            rp(options)
            .then((body) => {
                this.callbackAndResolve(resolve, {
                    success: true,
                    message: JSON.parse(body)
                }, callback);
            })
            .catch((err) => {
                this.callbackAndResolve(resolve, {
                    success: false,
                    message: err,
                }, callback);
            });
        });
    }

    /**
     *
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    filepay(request: { data: any[], pay: { key: string }}, callback?: Function): Promise<any> {
        return new Promise(async (resolve, reject) => {
            filepay.send({
                data: request.data,
                pay: {
                    key: request.pay.key,
                }
            }, async (err: any, txid: any, fee: any, rawtx: any) => {
                if (err) {
                    console.log('err', err, txid, rawtx);
                    return this.callbackAndResolve(resolve, {
                        success: false,
                        message: err.message ? err.message : err.toString()
                    }, callback);
                }
                return this.callbackAndResolve(resolve, {
                    success: true,
                    txid: txid,
                    fee: fee,
                    rawtx: rawtx
                }, callback)
            })
        });
    }

    /**
     * Datapay  adapter
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    datapay(request: { data: any[], pay: { key: string }}, callback?: Function): Promise<any> {
        return this.filepay(request, callback);
    }

    /**
     * Hex encode data. Also lowercase any hex data
     * @param data data to hex encode if it's not already hex
     */
    hexEncodeIfNeeded(data: string | undefined): string {
        if (!data) {
            return '0x00';
        }
        const checkHexPrefixRegex = /^0x(.*)/i;
        const match = checkHexPrefixRegex.exec(data);
        if (match && match[1]) {
            return data.toLowerCase();
        }
        return '0x' + this.hexEncode(data).toLowerCase();
    }

    /**for (let count = 0; count < indexes
     * Builds the file and returns the parameters to send to filepay
     *
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    buildFile(request: { file: FileData, signatures?: Array<{ key: string, indexes?: number[] }> }, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!request.file) {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'file required'
                }, callback);
            }

            if (!request.file.content) {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'content required'
                }, callback);
            }

            if (!request.file.contentType) {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'contentType required'
                }, callback);
            }

            try {
                let encoding = request.file.encoding ? request.file.encoding : 'utf-8';
                if (this.isUtf8(encoding)) {
                    encoding = 'utf-8';
                }
                let args = [
                    '0x' + Buffer.from("19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut").toString('hex'),
                    this.hexEncodeIfNeeded(request.file.content),
                    this.hexEncodeIfNeeded(request.file.contentType),
                    this.hexEncodeIfNeeded(encoding)
                ];
                const hasFileName = request.file.name && request.file.name !== '';
                let filename = request.file.name ? request.file.name : '0x00';
                args.push(this.hexEncodeIfNeeded(filename));
                if (request.file.tags) {
                    request.file.tags.map((tag) => args.push(this.hexEncodeIfNeeded(tag)));
                }
                // Attach signatures if they are provided
                if (request.signatures && Array.isArray(request.signatures)) {
                    for (const signatureKey of request.signatures) {
                        if (!signatureKey.key || /^\s*$/.test(signatureKey.key)) {
                            return this.callbackAndResolve(resolve, {
                                success: false,
                                message: 'signature key required'
                            }, callback);
                        }
                        const identityPrivateKey = new filepay.bsv.PrivateKey(signatureKey.key);
                        const identityAddress = identityPrivateKey.toAddress().toString();
                        args.push('0x' + Buffer.from('|').toString('hex'));
                        const opReturnHexArray = Utils.buildAuthorIdentity({
                            args: args,
                            address: identityAddress,
                            key: signatureKey.key,
                            indexes: signatureKey.indexes ? signatureKey.indexes : undefined
                        });
                        args = args.concat(opReturnHexArray);
                    }
                }
                return this.callbackAndResolve(resolve, {
                    success: true,
                    data: args,
                }, callback);

            } catch (ex) {
                console.log('ex', ex);
                this.callbackAndResolve(resolve, {
                    success: false,
                    message: ex.message ? ex.message : ex.toString()
                }, callback)
            }
        });
    }
    /**
     * Get file tx
     * @param txid txid of file
     * @param callback Optional callback to invoke after completed
     */
    file_get(txid: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/${txid}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }
    tx_get(txid: string, additionalParams?: { inputInfo: boolean, raw: boolean, includeBlock: boolean}, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = `/tx/${txid}?inputInfo=${additionalParams && additionalParams.inputInfo ? 1 : 0}&includeBlock=${additionalParams && additionalParams.includeBlock ? 1 : 0}&raw=${additionalParams && additionalParams.raw ? 1 : 0}`;
            axios.get(this.options.media_base + url,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    /**
     * Get raw tx
     * @param txid txid of file
     * @param callback Optional callback to invoke after completed
     */
    txraw_get(txid: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/tx/${txid}/raw`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    /**
     * Resolve a promise and/or invoke a callback
     * @param resolve Resolve function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    private resolveOrCallback(resolve?: Function, data?: any, callback?: Function) {
        if (callback) {
            callback(data);
            return undefined;
        }
        if (resolve) {
            return resolve(data);
        }
        return new Promise((r, reject) => {
            return r(data);
        });
    }

     /**
     * Resolve a promise and/or invoke a callback
     * @param reject Reject function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    private rejectOrCallback(reject?: Function, err?: any, callback?: Function) {
        if (callback) {
            callback(null, err);
            return;
        }
        if (reject) {
            return reject(err);
        }
        return new Promise((resolve, r) => {
            r(err);
        });
    }
    private formatErrorResponse(r: any): any {
        // let getMessage = r && r.response && r.response.data ? r.response.data : r.toString();
        let getMessage = r && r.response && r.response.data ? r.response.data : r;
        return {
            success: getMessage.success ? getMessage.success : false,
            code: getMessage.code ? getMessage.code : -1,
            message: getMessage.message ? getMessage.message : '',
            error: getMessage.error ? getMessage.error : '',
        };
    }
    block_getRaw(blockhash: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/rawblock/${blockhash}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    block_getWithFilter(blockhash: string, filter?: {
        base?: string,
        outputFilter?: string[],
        outputFilterId?: string,
      }, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            let outputFilterStr = '';
            if (filter && filter.outputFilter) {
                outputFilterStr = filter.outputFilter.join(',');
            }
            let filterBase = filter && filter.base ? `/${filter.base}` : '';
            let filterOutputFilterId = filter && filter.outputFilterId ? filter.outputFilterId : '';
            const url = this.options.media_base + `/block/${blockhash}/tx/filter${filterBase}?outputFilter=${outputFilterStr}&outputFilterId=${filterOutputFilterId}`;
            axios.get(url,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    block_get(blockhash: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/block/${blockhash}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }
    block_getHeaderRaw(blockhash: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/rawblockheader/${blockhash}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }
    block_getHeader(blockhash: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/blockheader/${blockhash}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    block_getBlockHash(height: number, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/height/${height}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }
    block_getBlockchainInfo(callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/blockchain/status`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    block_getTxOutProof(txid: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/txproof/${txid}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    block_getTxOutProofString(txid: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/txproof/${txid}/raw`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    block_verifyTxOutProof(proof: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/txproof/verify/${proof}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    outputfilter_save(outputs: string[], callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            const opts = {
                headers: this.getHeaders(),
                maxContentLength: 10000000000,
            }
            opts['maxBodyLength'] = 1000000000;
            axios.post(this.options.api_base + `/outputfilter`,
                {
                    add: outputs
                },
                opts,
                ).then((response) => {
                    return this.resolveOrCallback(resolve, response.data, callback);
                }).catch((ex) => {
                    return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
                })
        });
    }

    outputfilter_get(outputFilterId: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.media_base + `/outputfilter` + (outputFilterId ? `/${outputFilterId}` : ''),
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }


}
