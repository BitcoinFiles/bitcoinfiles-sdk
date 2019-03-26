
import { Client } from './client';
import { FileData } from './models/file-data.interface';
import { Utils, VerificationResult } from './utils';

/**
 * Decode a b:// or bitcoinasset:// URL to a hosting provider
 * @param url The url to decode. Correctly decodes b:// and bitcoinasset:// URLs and replaces it with the provided fileHostBase
 * @param fileHostBase Default: 'https://media.bitcoinfiles.org/'
 */
export function getFileUrl(url: string, fileHostBase = 'https://media.bitcoinfiles.org/'): string {
  const bRegex = /^(bitcoinasset|b):\/\/(.+)?#?/i;
  const match = bRegex.exec(url);
  if (match) {
    return `${fileHostBase}${match[2]}`;
  }
  // Else return if there was no match
  return url;
}

/**
 * Build a Bitcoin Data File create request
 * @param request Request to create a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function buildFile(request: { file: FileData, signatures?: Array<{ key: string }> }, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.buildFile(request, callback);
}


/**
 * Create a Bitcoin Data File
 * @param request Request to create a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function createFile(request: { file: FileData, pay: { key: string }, signatures: Array<{ key: string }> }, callback?: Function, options?: any): Promise<any> {
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
 * Create a Bitcoin Data File
 * @param request Request to create a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function find(request: {
  address?: string,
  contentType?: string,
  name?: string,
  tags?: string[],
  offset?: number,
  limit?: number,
  sort?: -1 | 1,
  sortField?: string
}, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.find(request, callback);
}

/**
 * Get a Bitcoin Data File by txid
 * @param txid txid of bitoin file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function get(txid: string, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.get(txid, callback);
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

export default class BitcoinFiles {
  options = undefined;

  constructor(options?: any) {
    if (options) {
      this.options = options;
    }
  }

  createFile(request: { file: FileData, pay: { key: string }, signatures: Array<{ key: string }> }, callback?: Function): Promise<any> {
    return createFile(request, callback, this.options);
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
