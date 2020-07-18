"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanner = exports.instance = exports.detectAndVerifyAuthorIdentitiesByTx = exports.detectAndVerifyAuthorIdentities = exports.verifyAuthorIdentity = exports.buildAuthorIdentity = exports.signArguments = exports.getTx = exports.datapay = exports.filepay = exports.queueFile = exports.createFile = exports.buildFile = void 0;
const client_1 = require("./client");
const utils_1 = require("./utils");
const scanner_1 = require("./scanner");
const defaultOptions = {
    api_key: '',
    api_base: 'https://api.bitcoinfiles.org',
    media_base: 'https://media.bitcoinfiles.org',
    stream_base: 'https://stream.bitcoinfiles.org',
};
/**
 * Build a Bitcoin Data File create request
 * @param request Request to create a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
function buildFile(request, callback, options) {
    const client = new client_1.Client(options);
    return client.buildFile(request, callback);
}
exports.buildFile = buildFile;
/**
 * Create a Bitcoin Data File
 * @param request Request to create a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
function createFile(request, callback, options) {
    const client = new client_1.Client(options);
    return client.create(request, callback);
}
exports.createFile = createFile;
/**
 * Queue a Bitcoin Data File Upload
 * @param request Request to upload a file
 * @param callback Optional callback to invoke
 * @param options Options override
 */
function queueFile(request, callback, options) {
    const client = new client_1.Client(options);
    return client.queueFile(request, callback);
}
exports.queueFile = queueFile;
/**
 * filepay wrapper
 * @param request Request to filepay
 * @param callback Optional callback to invoke
 * @param options Options override
 */
function filepay(request, callback, options) {
    const client = new client_1.Client(options);
    return client.filepay(request, callback);
}
exports.filepay = filepay;
/**
 * datapay adapter wrapper
 * @param request Request to filepay
 * @param callback Optional callback to invoke
 * @param options Options override
 */
function datapay(request, callback, options) {
    const client = new client_1.Client(options);
    return client.filepay(request, callback);
}
exports.datapay = datapay;
/**
 * Get a Bitcoin Data File by txid
 * @param txid txid of bitoin file
 * @param callback Optional callback to invoke
 * @param additionalParams { inputInfo: boolean, raw: boolean, includeBlock: boolean}
 * @param options Options override
 */
function getTx(txid, callback, additionalParams, options) {
    const client = new client_1.Client(options);
    return client.tx_get(txid, additionalParams, callback);
}
exports.getTx = getTx;
/**
 * Sign arguments with address key to get a signature
 * @param payload
 */
function signArguments(payload) {
    return utils_1.Utils.signArguments(payload);
}
exports.signArguments = signArguments;
/**
 * Build an array of hex strings representing the AUTHOR_IDENTITY protocol
 * @param payload
 */
function buildAuthorIdentity(payload) {
    return utils_1.Utils.buildAuthorIdentity(payload);
}
exports.buildAuthorIdentity = buildAuthorIdentity;
/**
 *
 * @param args Arguments from an OP_RETURN
 * @param expectedAuthorAddresses Array of addresses that are expected to sign in order
 */
function verifyAuthorIdentity(args, expectedAuthorAddresses) {
    return utils_1.Utils.verifyAuthorIdentity(args, expectedAuthorAddresses);
}
exports.verifyAuthorIdentity = verifyAuthorIdentity;
/**
 * Detect and verify addresses
 * @param args Arguments from an OP_RETURN
 */
function detectAndVerifyAuthorIdentities(args) {
    return utils_1.Utils.detectAndVerifyAuthorIdentities(args);
}
exports.detectAndVerifyAuthorIdentities = detectAndVerifyAuthorIdentities;
/**
 * Detect and verify addresses by rawtx
 * @param rawtx raw tx to detect
 */
function detectAndVerifyAuthorIdentitiesByTx(rawtx) {
    return utils_1.Utils.detectAndVerifyAuthorIdentitiesByTx(rawtx);
}
exports.detectAndVerifyAuthorIdentitiesByTx = detectAndVerifyAuthorIdentitiesByTx;
function instance(newOptions) {
    const mergedOptions = Object.assign({}, defaultOptions, newOptions);
    return new BitcoinFiles(mergedOptions);
}
exports.instance = instance;
class BitcoinFiles {
    constructor(options) {
        this.options = undefined;
        if (options) {
            this.options = options;
        }
    }
    buildFile(request, callback) {
        const client = new client_1.Client(this.options);
        return client.buildFile(request, callback);
    }
    createFile(request, callback) {
        const client = new client_1.Client(this.options);
        return client.create(request, callback);
    }
    queueFile(request, callback) {
        const client = new client_1.Client(this.options);
        return client.queueFile(request, callback);
    }
    getFile(txid, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.file_get(txid, callback);
    }
    getTx(txid, callback, additionalParams) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.tx_get(txid, additionalParams, callback);
    }
    getTxRaw(txid, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.txraw_get(txid, callback);
    }
    getBlock(blockhash, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.block_get(blockhash, callback);
    }
    getBlockFiltered(blockhash, filterOptions, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.block_getWithFilter(blockhash, filterOptions, callback);
    }
    getBlockRaw(blockhash, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.block_getRaw(blockhash, callback);
    }
    getBlockHeader(blockhash, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.block_getHeader(blockhash, callback);
    }
    getBlockHeaderRaw(blockhash, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.block_getHeaderRaw(blockhash, callback);
    }
    getBlockHash(height, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.block_getBlockHash(height, callback);
    }
    getBlockchainInfo(callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.block_getBlockchainInfo(callback);
    }
    getTxOutProof(txid, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.block_getTxOutProof(txid, callback);
    }
    getTxOutProofString(txid, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.block_getTxOutProofString(txid, callback);
    }
    verifyTxOutProofString(proof, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.block_verifyTxOutProof(proof, callback);
    }
    saveOutputFilter(outputs, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.outputfilter_save(outputs, callback);
    }
    getOutputFilter(outputfilterId, callback) {
        const apiClient = new client_1.Client(this.options);
        return apiClient.outputfilter_get(outputfilterId, callback);
    }
    scanner(options) {
        return new scanner_1.BlockchainScanner(Object.assign({}, this.options, options));
    }
}
exports.default = BitcoinFiles;
function scanner(options) {
    return new scanner_1.BlockchainScanner(Object.assign({}, defaultOptions, options));
}
exports.scanner = scanner;
try {
    if (window) {
        window['BitcoinFiles'] = BitcoinFiles;
    }
}
catch (ex) {
    console.log('window not defined...');
}
