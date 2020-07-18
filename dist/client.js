"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const filepay = require("filepay");
const axios_1 = require("axios");
const textEncoder = require("text-encoder");
const utils_1 = require("./utils");
const FormData = require("form-data");
const rp = require("request-promise");
const defaultOptions = {
    api_key: '',
    api_base: 'https://api.bitcoinfiles.org',
    media_base: 'https://media.bitcoinfiles.org',
    stream_base: 'https://stream.bitcoinfiles.org',
};
/**
 * Client provides abilities to create and get bitcoinfiles
 */
class Client {
    constructor(optionsOver) {
        this.options = defaultOptions;
        if (optionsOver) {
            this.options = Object.assign({}, this.options, optionsOver);
        }
    }
    // Populate api reqest header if it's set
    getHeaders() {
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
    callbackAndResolve(resolveOrReject, data, callback) {
        if (callback) {
            callback(data);
        }
        if (resolveOrReject) {
            return resolveOrReject(data);
        }
    }
    hexEncode(str) {
        function buf2hex(buffer) {
            const hexStr = Array.prototype.map.call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2)).join('');
            return hexStr.toLowerCase();
        }
        const checkHexPrefixRegex = /^0x(.*)/i;
        const match = checkHexPrefixRegex.exec(str);
        if (match) {
            return str;
        }
        else {
            let enc = new textEncoder.TextEncoder().encode(str);
            return buf2hex(enc);
        }
    }
    isUtf8(encoding) {
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
    create(request, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.pay || !request.pay.key || request.pay.key === '') {
                return new Promise((resolve) => {
                    return this.callbackAndResolve(resolve, {
                        success: false,
                        message: 'key required'
                    }, callback);
                });
            }
            const buildResult = yield this.buildFile(request);
            if (!buildResult.success) {
                return new Promise((resolve) => {
                    this.callbackAndResolve(resolve, {
                        success: false,
                        message: buildResult.message
                    }, callback);
                });
            }
            const newArgs = [];
            for (const i of buildResult.data) {
                const checkHexPrefixRegex = /^0x(.*)/i;
                const match = checkHexPrefixRegex.exec(i);
                if (match && match[1]) {
                    newArgs.push(i);
                }
                else {
                    newArgs.push('0x' + i);
                }
            }
            return this.filepay({
                data: newArgs,
                pay: request.pay,
            }, (o) => {
                callback ? callback(o) : null;
            });
        });
    }
    /**
     * Queue a request to cache the file on BitcoinFiles.org and settle on BSV blockchain after payment is received.
     * The response contains a 'payment_sats_needed' field and an 'payment_address` that can be used to pay for queuing into a tx.
     * @param request
     * @param callback
     */
    queueFile(request, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxBytes = 10000000;
            return new Promise((resolve, reject) => {
                const formData = new FormData({ maxDataSize: maxBytes });
                const opts = {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    maxContentLength: maxBytes,
                };
                opts['maxBodyLength'] = maxBytes;
                formData.append("file", Buffer.from(request.file.content, request.file.encoding ? request.file.encoding : 'hex'));
                const url = `${this.options.api_base}/upload` + (request.session_tag ? `?session_tag=${request.session_tag}` : '');
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
        });
    }
    /**
     *
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    filepay(request, callback) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            filepay.send({
                data: request.data,
                pay: {
                    key: request.pay.key,
                }
            }, (err, txid, fee, rawtx) => __awaiter(this, void 0, void 0, function* () {
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
                }, callback);
            }));
        }));
    }
    /**
     * Datapay  adapter
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    datapay(request, callback) {
        return this.filepay(request, callback);
    }
    /**
     * Hex encode data. Also lowercase any hex data
     * @param data data to hex encode if it's not already hex
     */
    hexEncodeIfNeeded(data) {
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
    buildFile(request, callback) {
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
                        const opReturnHexArray = utils_1.Utils.buildAuthorIdentity({
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
            }
            catch (ex) {
                console.log('ex', ex);
                this.callbackAndResolve(resolve, {
                    success: false,
                    message: ex.message ? ex.message : ex.toString()
                }, callback);
            }
        });
    }
    /**
     * Get file tx
     * @param txid txid of file
     * @param callback Optional callback to invoke after completed
     */
    file_get(txid, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/${txid}`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    tx_get(txid, additionalParams, callback) {
        return new Promise((resolve, reject) => {
            const url = `/tx/${txid}?inputInfo=${additionalParams && additionalParams.inputInfo ? 1 : 0}&includeBlock=${additionalParams && additionalParams.includeBlock ? 1 : 0}&raw=${additionalParams && additionalParams.raw ? 1 : 0}`;
            axios_1.default.get(this.options.media_base + url, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    /**
     * Get raw tx
     * @param txid txid of file
     * @param callback Optional callback to invoke after completed
     */
    txraw_get(txid, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/tx/${txid}/raw`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    /**
     * Resolve a promise and/or invoke a callback
     * @param resolve Resolve function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    resolveOrCallback(resolve, data, callback) {
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
    rejectOrCallback(reject, err, callback) {
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
    formatErrorResponse(r) {
        // let getMessage = r && r.response && r.response.data ? r.response.data : r.toString();
        let getMessage = r && r.response && r.response.data ? r.response.data : r;
        return {
            success: getMessage.success ? getMessage.success : false,
            code: getMessage.code ? getMessage.code : -1,
            message: getMessage.message ? getMessage.message : '',
            error: getMessage.error ? getMessage.error : '',
        };
    }
    block_getRaw(blockhash, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/rawblock/${blockhash}`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    block_getWithFilter(blockhash, filter, callback) {
        return new Promise((resolve, reject) => {
            let outputFilterStr = '';
            if (filter && filter.outputFilter) {
                outputFilterStr = filter.outputFilter.join(',');
            }
            let filterBase = filter && filter.base ? `/${filter.base}` : '';
            let filterOutputFilterId = filter && filter.outputFilterId ? filter.outputFilterId : '';
            const url = this.options.media_base + `/block/${blockhash}/tx/filter${filterBase}?outputFilter=${outputFilterStr}&outputFilterId=${filterOutputFilterId}`;
            axios_1.default.get(url, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    block_get(blockhash, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/block/${blockhash}`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    block_getHeaderRaw(blockhash, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/rawblockheader/${blockhash}`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    block_getHeader(blockhash, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/blockheader/${blockhash}`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    block_getBlockHash(height, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/height/${height}`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    block_getBlockchainInfo(callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/blockchain/status`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    block_getTxOutProof(txid, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/txproof/${txid}`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    block_getTxOutProofString(txid, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/txproof/${txid}/raw`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    block_verifyTxOutProof(proof, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/txproof/verify/${proof}`, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    outputfilter_save(outputs, callback) {
        return new Promise((resolve, reject) => {
            const opts = {
                headers: this.getHeaders(),
                maxContentLength: 10000000000,
            };
            opts['maxBodyLength'] = 1000000000;
            axios_1.default.post(this.options.api_base + `/outputfilter`, {
                add: outputs
            }, opts).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    outputfilter_get(outputFilterId, callback) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(this.options.media_base + `/outputfilter` + (outputFilterId ? `/${outputFilterId}` : ''), {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
}
exports.Client = Client;
