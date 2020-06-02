import { FileData } from './models/file-data.interface';
import { VerificationResult } from './utils';
import { BlockchainScanner } from './scanner';
/**
 * Build a Bitcoin Data File create request
 * @param request Request to create a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export declare function buildFile(request: {
    file: FileData;
    signatures?: Array<{
        key: string;
        number?: string[];
    }>;
}, callback?: Function, options?: any): Promise<any>;
/**
 * Create a Bitcoin Data File
 * @param request Request to create a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export declare function createFile(request: {
    file: FileData;
    pay: {
        key: string;
    };
    signatures: Array<{
        key: string;
        indexes?: number[];
    }>;
}, callback?: Function, options?: any): Promise<any>;
/**
 * Queue a Bitcoin Data File Upload
 * @param request Request to upload a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export declare function queueFile(request: {
    file: FileData;
    session_tag?: string;
}, callback?: Function, options?: any): Promise<any>;
/**
 * Datapay wrapper
 * @param request Request to datapay
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export declare function datapay(request: {
    data: any[];
    pay: {
        key: string;
    };
}, callback?: Function, options?: any): Promise<any>;
/**
 * Get a Bitcoin Data File by txid
 * @param txid txid of bitoin file
 * @param callback Optional callback to invoke
 * @param additionalParams { inputInfo: boolean, raw: boolean, includeBlock: boolean}
 * @param options Options override
 */
export declare function getTx(txid: string, callback?: Function, additionalParams?: {
    inputInfo: boolean;
    raw: boolean;
    includeBlock: boolean;
}, options?: any): Promise<any>;
/**
 * Sign arguments with address key to get a signature
 * @param payload
 */
export declare function signArguments(payload: {
    args: any[];
    address: string;
    key: string;
    indexes: number[];
}): string;
/**
 * Build an array of hex strings representing the AUTHOR_IDENTITY protocol
 * @param payload
 */
export declare function buildAuthorIdentity(payload: {
    args: any[];
    address: string;
    key: string;
    indexes: number[];
}): Array<string>;
/**
 *
 * @param args Arguments from an OP_RETURN
 * @param expectedAuthorAddresses Array of addresses that are expected to sign in order
 */
export declare function verifyAuthorIdentity(args: any[], expectedAuthorAddresses: string[] | string): VerificationResult;
/**
 * Detect and verify addresses
 * @param args Arguments from an OP_RETURN
 */
export declare function detectAndVerifyAuthorIdentities(args: any[]): VerificationResult;
/**
 * Detect and verify addresses by rawtx
 * @param rawtx raw tx to detect
 */
export declare function detectAndVerifyAuthorIdentitiesByTx(rawtx: any): VerificationResult;
export declare function instance(newOptions?: any): BitcoinFiles;
export default class BitcoinFiles {
    options: undefined;
    constructor(options?: any);
    buildFile(request: {
        file: FileData;
        pay: {
            key: string;
        };
        signatures: Array<{
            key: string;
        }>;
    }, callback?: Function): Promise<any>;
    createFile(request: {
        file: FileData;
        pay: {
            key: string;
        };
        signatures: Array<{
            key: string;
        }>;
    }, callback?: Function): Promise<any>;
    queueFile(request: {
        file: FileData;
        session_tag?: string;
    }, callback?: Function): Promise<any>;
    getFile(txid: string, callback?: Function): Promise<any>;
    getTx(txid: string, callback?: Function, additionalParams?: {
        inputInfo: boolean;
        raw: boolean;
        includeBlock: boolean;
    }): Promise<any>;
    getTxRaw(txid: string, callback?: Function): Promise<any>;
    getBlock(blockhash: string, callback?: Function): Promise<any>;
    getBlockFiltered(blockhash: string, filterOptions?: {
        base?: string;
        outputFilter?: string[];
        outputFilterId?: string;
    }, callback?: Function): Promise<any>;
    getBlockRaw(blockhash: string, callback?: Function): Promise<any>;
    getBlockHeader(blockhash: string, callback?: Function): Promise<any>;
    getBlockHeaderRaw(blockhash: string, callback?: Function): Promise<any>;
    getBlockHash(height: number, callback?: Function): Promise<any>;
    getBlockchainInfo(callback?: Function): Promise<any>;
    getTxOutProof(txid: string, callback?: Function): Promise<any>;
    getTxOutProofString(txid: string, callback?: Function): Promise<any>;
    verifyTxOutProofString(proof: string, callback?: Function): Promise<any>;
    saveOutputFilter(outputs: string[], callback?: Function): Promise<any>;
    getOutputFilter(outputfilterId: string, callback?: Function): Promise<any>;
    scanner(options?: any): BlockchainScanner;
}
export declare function scanner(options?: any): BlockchainScanner;
