
import { Client } from './client';
import { FileData } from './models/file-data.interface';
import { Utils, VerificationResult } from './utils';
import { BlockchainScanner } from './scanner';

const defaultOptions = {
  api_key: '',
  api_base: 'https://api.bitcoinfiles.org',
  media_base: 'https://media.bitcoinfiles.org',
  stream_base: 'https://stream.bitcoinfiles.org',
}

/**
 * Build a Bitcoin Data File create request
 * @param request Request to create a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function buildFile(request: { file: FileData, signatures?: Array<{ key: string, number?: string[] }> }, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.buildFile(request, callback);
}

/**
 * Create a Bitcoin Data File
 * @param request Request to create a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function createFile(request: { file: FileData, pay: { key: string }, signatures: Array<{ key: string, indexes?: number[]}> }, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.create(request, callback);
}

/**
 * Queue a Bitcoin Data File Upload
 * @param request Request to upload a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function queueFile(request: { file: FileData, session_tag?: string }, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.queueFile(request, callback);
}

export function payQueuedFiles(rawtx: string, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.payQueuedFiles(rawtx, callback);
}
/**
 * filepay wrapper
 * @param request Request to filepay
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function filepay(request: { data: any[], pay: { key: string }}, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.filepay(request, callback);
}

/**
 * datapay adapter wrapper
 * @param request Request to filepay
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function datapay(request: { data: any[], pay: { key: string }}, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.filepay(request, callback);
}

/**
 * Get a Bitcoin Data File by txid
 * @param txid txid of bitoin file
 * @param callback Optional callback to invoke
 * @param additionalParams { inputInfo: boolean, raw: boolean, includeBlock: boolean}
 * @param options Options override
 */
export function getTx(txid: string, callback?: Function, additionalParams?: { inputInfo: boolean, raw: boolean, includeBlock: boolean }, options?: any): Promise<any> {
  const client = new Client(options);
  return client.tx_get(txid, additionalParams, callback);
}

/**
 * Sign arguments with address key to get a signature
 * @param payload
 */
export function signArguments(payload: { args: any[], address: string, key: string, indexes: number[] }): string {
  return Utils.signArguments(payload);
}

/**
 * Build an array of hex strings representing the AUTHOR_IDENTITY protocol
 * @param payload
 */
export function buildAuthorIdentity(payload: { args: any[], address: string, key: string, indexes: number[] }): Array<string> {
  return Utils.buildAuthorIdentity(payload);
}

/**
 *
 * @param args Arguments from an OP_RETURN
 * @param expectedAuthorAddresses Array of addresses that are expected to sign in order
 */
export function verifyAuthorIdentity(args: any[], expectedAuthorAddresses: string[] | string): VerificationResult {
  return Utils.verifyAuthorIdentity(args, expectedAuthorAddresses);
}

/**
 * Detect and verify addresses
 * @param args Arguments from an OP_RETURN
 */
export function detectAndVerifyAuthorIdentities(args: any[]): VerificationResult {
  return Utils.detectAndVerifyAuthorIdentities(args);
}

/**
 * Detect and verify addresses by rawtx
 * @param rawtx raw tx to detect
 */
export function detectAndVerifyAuthorIdentitiesByTx(rawtx): { [key: string] : VerificationResult }  {
  return Utils.detectAndVerifyAuthorIdentitiesByTx(rawtx);
}

export function instance(newOptions?: any): BitcoinFiles {
  const mergedOptions = Object.assign({}, defaultOptions, newOptions);
  return new BitcoinFiles(mergedOptions);
}

export default class BitcoinFiles {
  options = undefined;

  constructor(options?: any) {
    if (options) {
      this.options = options;
    }
  }

  payQueuedFiles(rawtx: string, callback?: Function): Promise<any> {
    const client = new Client(this.options);
    return client.payQueuedFiles(rawtx, callback);
  }

  buildFile(request: { file: FileData, pay: { key: string }, signatures: Array<{ key: string }> }, callback?: Function): Promise<any> {
    const client = new Client(this.options);
    return client.buildFile(request, callback);
  }

  createFile(request: { file: FileData, pay: { key: string }, signatures: Array<{ key: string }> }, callback?: Function): Promise<any> {
    const client = new Client(this.options);
    return client.create(request, callback);
  }

  queueFile(request: { file: FileData, session_tag?: string}, callback?: Function): Promise<any> {
    const client = new Client(this.options);
    return client.queueFile(request, callback);
  }

  getFile(txid: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.file_get(txid, callback);
  }
  getTx(txid: string, callback?: Function, additionalParams?: { inputInfo: boolean, raw: boolean, includeBlock: boolean}): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.tx_get(txid, additionalParams, callback);
  }

  getTxRaw(txid: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.txraw_get(txid, callback);
  }
  getBlock(blockhash: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.block_get(blockhash, callback);
  }
  getBlockFiltered(blockhash: string, filterOptions?: {
      base?: string,
      outputFilter?: string[],
      outputFilterId?: string,
    }, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.block_getWithFilter(blockhash, filterOptions, callback);
  }

  getBlockRaw(blockhash: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.block_getRaw(blockhash, callback);
  }
  getBlockHeader(blockhash: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.block_getHeader(blockhash, callback);
  }
  getBlockHeaderRaw(blockhash: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.block_getHeaderRaw(blockhash, callback);
  }
  getBlockHash(height: number, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.block_getBlockHash(height, callback);
  }
  getBlockchainInfo(callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.block_getBlockchainInfo(callback);
  }
  getTxOutProof(txid: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.block_getTxOutProof(txid, callback);
  }
  getTxOutProofString(txid: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.block_getTxOutProofString(txid, callback);
  }
  verifyTxOutProofString(proof: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.block_verifyTxOutProof(proof, callback);
  }
  saveOutputFilter(outputs: string[], callback?: Function) {
    const apiClient = new Client(this.options);
    return apiClient.outputfilter_save(outputs, callback);
  }
  getOutputFilter(outputfilterId : string, callback?: Function) {
    const apiClient = new Client(this.options);
    return apiClient.outputfilter_get(outputfilterId, callback);
  }

  scanner(options?) {
    return new BlockchainScanner(Object.assign({}, this.options, options));
  }
}

export function scanner(options?) {
  return new BlockchainScanner(Object.assign({}, defaultOptions, options));
}

try {
  if (window) {
    window['BitcoinFiles'] = BitcoinFiles;
  }
}
catch (ex) {
    console.log('window not defined...');
}
