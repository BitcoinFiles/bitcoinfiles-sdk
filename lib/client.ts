import * as datapay from 'datapay';
import axios from 'axios';
import { FileData } from './models/file-data.interface';
declare var Buffer: any;
import * as textEncoder from 'text-encoder';
import { Utils } from './utils';

const defaultOptions = {
    bitcoinfiles_api_base: 'https://media.bitcoinfiles.org',
    api_key: '',
}

/**
 * Client provides abilities to create and get bitcoinfiles
 */
export class Client {
    options = defaultOptions;
    constructor(options: any) {
        this.options = Object.assign({}, this.options, options);
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
        return this.datapay({
            data: newArgs,
            pay: request.pay,
        }, callback);
    }

    /**
     *
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    datapay(request: { data: any[], pay: { key: string }}, callback?: Function): Promise<any> {
        return new Promise(async (resolve, reject) => {
            datapay.send({
                data: request.data,
                pay: {
                    key: request.pay.key,
                }
            }, async (err: any, transaction: any) => {
                if (err) {
                    console.log('err', err);
                    return this.callbackAndResolve(resolve, {
                        success: false,
                        message: err.message ? err.message : err.toString()
                    }, callback);
                }
                return this.callbackAndResolve(resolve, {
                    success: true,
                    txid: transaction
                }, callback)
            })
        });
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
     * Builds the file and returns the parameters to send to datapay
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
                        const identityPrivateKey = new datapay.bsv.PrivateKey(signatureKey.key);
                        const identityAddress = identityPrivateKey.toAddress().toLegacyAddress();
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
            axios.get(this.options.bitcoinfiles_api_base + `/${txid}`,
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
    tx_get(txid: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.bitcoinfiles_api_base + `/tx/${txid}`,
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
            axios.get(this.options.bitcoinfiles_api_base + `/tx/${txid}/raw`,
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
            axios.get(this.options.bitcoinfiles_api_base + `/rawblock/${blockhash}`,
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
            axios.get(this.options.bitcoinfiles_api_base + `/block/${blockhash}`,
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
            axios.get(this.options.bitcoinfiles_api_base + `/rawblockheader/${blockhash}`,
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
            axios.get(this.options.bitcoinfiles_api_base + `/blockheader/${blockhash}`,
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
            axios.get(this.options.bitcoinfiles_api_base + `/height/${height}`,
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