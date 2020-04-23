
import { Client } from './client';
import { FileData } from './models/file-data.interface';
import { Utils, VerificationResult } from './utils';

const defaultOptions = {
  bitcoinfiles_api_base: 'https://media.bitcoinfiles.org',
  api_key: '',
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
 * Datapay wrapper
 * @param request Request to datapay
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function datapay(request: { data: any[], pay: { key: string }}, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.datapay(request, callback);
}

/**
 * Get a Bitcoin Data File by txid
 * @param txid txid of bitoin file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function getTx(txid: string, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.tx_get(txid, callback);
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
  buildFile(request: { file: FileData, pay: { key: string }, signatures: Array<{ key: string }> }, callback?: Function): Promise<any> {
    const client = new Client(this.options);
    return client.buildFile(request, callback);
  }
  createFile(request: { file: FileData, pay: { key: string }, signatures: Array<{ key: string }> }, callback?: Function): Promise<any> {
    const client = new Client(this.options);
    return client.create(request, callback);
  }
  getFile(txid: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.file_get(txid, callback);
  }
  getTx(txid: string, callback?: Function): Promise<any> {
    const apiClient = new Client(this.options);
    return apiClient.tx_get(txid, callback);
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
  saveOutputFilter(outputs: { add: string[], remove: string[] }, outputfilterId : string | null, callback?: Function) {
    const apiClient = new Client(this.options);
    return apiClient.outputfilter_save(outputfilterId, outputs, callback);
  }
  getOutputFilter(outputfilterId : string, callback?: Function) {
    const apiClient = new Client(this.options);
    return apiClient.outputfilter_get(outputfilterId, callback);
  }
}

try {
  if (window) {
    window['BitcoinFiles'] = BitcoinFiles;
  }
}
catch (ex) {
    console.log('window not defined...');
}
