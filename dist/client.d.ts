import { FileData } from './models/file-data.interface';
/**
 * Client provides abilities to create and get bitcoinfiles
 */
export declare class Client {
    options: {
        api_key: string;
        api_base: string;
        media_base: string;
        stream_base: string;
    };
    constructor(optionsOver?: any);
    getHeaders(): any;
    /**
     * Resolve a promise and/or invoke a callback
     * @param resolveOrReject Resolve or reject function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    private callbackAndResolve;
    private hexEncode;
    private isUtf8;
    /**
     *
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    create(request: {
        file: FileData;
        pay: {
            key: string;
        };
        signatures: Array<{
            key: string;
            indexes?: number[];
        }>;
    }, callback?: Function): Promise<any>;
    /**
     * Pay for queued files to be converted to transactions and broadcast
     *
     * @param rawtx Rawtx that pays for queueFile(s)
     * @param callback optional callback
     */
    payQueuedFiles(rawtx: string, callback?: Function): Promise<any>;
    /**
     * Queue a request to cache the file on BitcoinFiles.org and settle on BSV blockchain after payment is received.
     * The response contains a 'payment_sats_needed' field and an 'payment_address` that can be used to pay for queuing into a tx.
     * @param request
     * @param callback
     */
    queueFile(request: {
        file: FileData;
        session_tag?: string;
    }, callback?: Function): Promise<any>;
    /**
     *
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    filepay(request: {
        data: any[];
        pay: {
            key: string;
        };
    }, callback?: Function): Promise<any>;
    /**
     * Datapay  adapter
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    datapay(request: {
        data: any[];
        pay: {
            key: string;
        };
    }, callback?: Function): Promise<any>;
    /**
     * Hex encode data. Also lowercase any hex data
     * @param data data to hex encode if it's not already hex
     */
    hexEncodeIfNeeded(data: string | undefined): string;
    /**for (let count = 0; count < indexes
     * Builds the file and returns the parameters to send to filepay
     *
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    buildFile(request: {
        file: FileData;
        signatures?: Array<{
            key: string;
            indexes?: number[];
        }>;
    }, callback?: Function): Promise<any>;
    /**
     * Get file tx
     * @param txid txid of file
     * @param callback Optional callback to invoke after completed
     */
    file_get(txid: string, callback?: Function): Promise<any>;
    tx_get(txid: string, additionalParams?: {
        inputInfo: boolean;
        raw: boolean;
        includeBlock: boolean;
    }, callback?: Function): Promise<any>;
    /**
     * Get raw tx
     * @param txid txid of file
     * @param callback Optional callback to invoke after completed
     */
    txraw_get(txid: string, callback?: Function): Promise<any>;
    /**
     * Resolve a promise and/or invoke a callback
     * @param resolve Resolve function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    private resolveOrCallback;
    /**
    * Resolve a promise and/or invoke a callback
    * @param reject Reject function to call when done
    * @param data Data to pass forward
    * @param callback Invoke an optional callback first
    */
    private rejectOrCallback;
    private formatErrorResponse;
    block_getRaw(blockhash: string, callback?: Function): Promise<any>;
    block_getWithFilter(blockhash: string, filter?: {
        base?: string;
        outputFilter?: string[];
        outputFilterId?: string;
    }, callback?: Function): Promise<any>;
    block_get(blockhash: string, callback?: Function): Promise<any>;
    block_getHeaderRaw(blockhash: string, callback?: Function): Promise<any>;
    block_getHeader(blockhash: string, callback?: Function): Promise<any>;
    block_getBlockHash(height: number, callback?: Function): Promise<any>;
    block_getBlockchainInfo(callback?: Function): Promise<any>;
    block_getTxOutProof(txid: string, callback?: Function): Promise<any>;
    block_getTxOutProofString(txid: string, callback?: Function): Promise<any>;
    block_verifyTxOutProof(proof: string, callback?: Function): Promise<any>;
    outputfilter_save(outputs: string[], callback?: Function): Promise<any>;
    outputfilter_get(outputFilterId: string, callback?: Function): Promise<any>;
}
