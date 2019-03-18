import * as datapay from 'datapay';
import * as bsv from 'bsv';
import axios from 'axios';
import { FileData } from './models/file-data.interface';
declare var Buffer: any;
import * as textEncoder from 'text-encoder';
import { Utils } from './utils';

function buf2hex(buffer: any) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
}

const defaultOptions = {
    bitdb_api_base: 'https://babel.bitdb.network/q/1DHDifPvtPgKFPZMRSxmVHhiPvFmxZwbfh/',
    bitdb_api_key: '12cHytySdrQGRtuvvkVde2j3e74rmEn5TM',
    bitcoinfiles_api_base: 'https://media.bitcoinfiles.org',
}

/**
 * Client provides abilities to create and get bitcoinfiles
 */
export class Client {
    options = defaultOptions;
    constructor(options: any) {
        this.options = Object.assign({}, this.options, options);
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
    async create(request: { file: FileData, pay: { key: string }, signatures: Array<{ key: string }> }, callback?: Function): Promise<any> {
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
     * Builds the file and returns the parameters to send to datapay
     *
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    buildFile(request: { file: FileData, pay: { key: string }, signatures: Array<{ key: string }> }, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!request.pay || !request.pay.key || request.pay.key === '') {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'key required'
                }, callback);
            }

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
                let content = '';
                if (this.isUtf8(encoding)) {
                    encoding = 'utf-8';
                    content = this.hexEncode(request.file.content)
                } else {
                    content = request.file.content
                }
                let args = [
                    '0x' + Buffer.from("19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut").toString('hex'),
                    '0x' + content,
                    '0x' + this.hexEncode(request.file.contentType),
                    '0x' + this.hexEncode(encoding)
                ];

                const hasFileName = request.file.name && request.file.name !== '';
                if (request.file && (hasFileName || (request.file.tags && request.file.tags.length))) {
                    let filename = request.file.name ? request.file.name : '';
                    args.push('0x' + this.hexEncode(filename));
                    if (request.file.tags) {
                        request.file.tags.map((tag) => args.push(this.hexEncode(tag)));
                    }
                }

                // Attach signatures if they are provided
                if (request.signatures && Array.isArray(request.signatures)) {
                    if (!hasFileName) {
                        // We must attach a blank or empty filename if we want a signature
                        args.push('0x00');
                    }
                    for (const signatureKey of request.signatures) {
                        if (!signatureKey.key || /^\s*$/.test(signatureKey.key)) {
                            return this.callbackAndResolve(resolve, {
                                success: false,
                                message: 'signature key required'
                            }, callback);
                        }
                        const identityPrivateKey = new bsv.PrivateKey(signatureKey.key);
                        const identityAddress = identityPrivateKey.toAddress().toLegacyAddress();
                        args.push('0x' + Buffer.from('|').toString('hex'));
                        const opReturnHexArray = Utils.buildAuthorIdentity({
                            args: args,
                            address: identityAddress,
                            key: signatureKey.key
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
     * Get a file by txid
     * @param txid txid of file
     * @param callback Optional callback to invoke after completed
     */
    get(txid: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!txid) {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'txid required'
                }, callback);
            }
            try {
                let query = this.baseQuery(-1, 0, 0, 'blk.i');
                query = this.addFindClause(query, 'tx.h', txid);

                axios.get(
                    this.options.bitdb_api_base + Buffer.from(JSON.stringify(query)).toString('base64'),
                    {
                        headers: { key: this.options.bitdb_api_key }
                    }
                ).then((response) => {
                    let tx = response.data.u[0] ? response.data.u[0] : response.data.c[0] ? response.data.c[0] : undefined;

                    if (!tx) {
                        throw Error('not found');
                    }
                    const formattedResults: any[] = [];
                    formattedResults.push(
                        {
                            txid: tx.txid,
                            url: `${this.options.bitcoinfiles_api_base}/${tx.txid}`
                        }
                    );
                    this.callbackAndResolve(resolve, {
                        success: true,
                        data: formattedResults
                    }, callback);

                }).catch((ex) => {
                    console.log('ex', ex);
                    this.callbackAndResolve(resolve, {
                        success: false,
                        message: ex.message ? ex.message : ex.toString()
                    }, callback)
                })
            } catch (ex) {
                console.log('ex', ex.toString(), ex);
                this.callbackAndResolve(resolve, {
                    success: false,
                    message: ex.message ? ex.message : ex.toString()
                }, callback)
            }
        });
    }
    /**
     * Find files matching certain criteria
     * @param request find request
     * @param callback Optional callback to invoke after completed
     */
    find(request: {
        address?: string,
        contentType?: string,
        name?: string,
        tags?: string[],
        skip?: number,
        limit?: number,
        sort?: -1 | 1,
        debug?: boolean,
        sortField?: string
    }, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!request) {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'field required'
                }, callback);
            }
            try {
                let sort = request.sort ? request.sort : -1;
                let limit = request.limit ? request.limit : 1;
                let skip = request.skip ? request.skip : 0;
                let sortField = request.sortField ? request.sortField : 'blk.i';
                let query = this.baseQuery(sort, limit, skip, sortField);

                if (request.address) {
                    query = this.addFindClause(query, 'in.e.a', request.address);
                }
                if (request.contentType) {
                    query = this.addFindClause(query, 'out.s3', request.contentType);
                }
                if (request.name) {
                    query = this.addFindClause(query, 'out.s5', request.name);
                }
                if (request.tags && request.tags.length) {
                    let tagStartIndex = 6;
                    for (const tag of request.tags) {
                        // Do not search on null or undefined tag, skip it
                        if (tag === undefined || tag === null) {
                            tagStartIndex++;
                            continue;
                        }
                        // If the value is prefixed with '0x' then we know it's hex
                        // Otherwise treat it as a string
                        const checkHexPrefixRegex = /^0x(.*)/i;
                        let tagField = 'out.s';
                        let tagValue = tag;
                        const match = checkHexPrefixRegex.exec(tag);
                        if (match && match[1]) {
                            tagField = 'out.h'
                            tagValue = match[1];
                        }
                        tagField += tagStartIndex;
                        query = this.addFindClause(query, tagField, tagValue);
                        tagStartIndex++;
                    }
                }
                if (request.debug) {
                    console.log('find query', query);
                }
                axios.get(
                    this.options.bitdb_api_base + Buffer.from(JSON.stringify(query)).toString('base64'),
                    {
                        headers: { key: this.options.bitdb_api_key }
                    }
                ).then((response) => {
                    let unconfirmed = response.data.u;
                    let confirmed = response.data.c;
                    let txs = [];

                    if (unconfirmed.length) {
                        txs = unconfirmed;
                    }
                    if (confirmed.length) {
                        txs = txs.concat(confirmed);
                    }

                    const formattedResults: any[] = [];
                    txs.map((tx: any) => {
                        formattedResults.push(
                            {
                                txid: tx.txid,
                                url: `${this.options.bitcoinfiles_api_base}/${tx.txid}`
                            }
                        );
                    });
                    this.callbackAndResolve(resolve, {
                        success: true,
                        data: formattedResults
                    }, callback);

                }).catch((ex) => {
                    console.log('ex', ex);
                    this.callbackAndResolve(resolve, {
                        success: false,
                        message: ex.message ? ex.message : ex.toString()
                    }, callback)
                })
            } catch (ex) {
                console.log('ex', ex.toString(), ex);
                this.callbackAndResolve(resolve, {
                    success: false,
                    message: ex.message ? ex.message : ex.toString()
                }, callback)
            }
        });
    }

    private baseQuery(sort: number = -1, limit: number = 1, skip: number = 0, sortField: string = 'blk.i'): any {
        return {
            "v": 3,
            "q": {
                "find": {
                },
                "limit": limit,
                "skip": skip,
                "sort": { [sortField]: sort}
            },
            "r": {
                "f": "[.[] | { txid: .tx.h, inputInfo: . | { in: .in? }, blockInfo: . | { blockIndex: .blk.i?, blockTime: .blk.t?}, out: .out  } ]"
            }
        }
    }

    private addFindClause(query: any, field: string, value: string): any {
        const updatedQuery = query;
        updatedQuery.q.find = Object.assign({}, updatedQuery.q.find, {
            [field]: value
        });
        return updatedQuery;
    }
}