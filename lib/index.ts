
import { Client } from './client';
import { FileData } from './models/file-data.interface';

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
 * Create a Bitcoin Data File
 * @param request Request to create a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
export function createFile(request: { file: FileData, pay: { key: string } }, callback?: Function, options?: any): Promise<any> {
  const client = new Client(options);
  return client.create(request, callback);
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
  sort?: -1 | 1
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

