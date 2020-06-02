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
exports.BlockchainScanner = void 0;
const EventSource = require('eventsource');
const defaultOptions = {
    api_base: 'https://api.bitcoinfiles.org',
    media_base: 'https://media.bitcoinfiles.org',
    stream_base: 'https://stream.bitcoinfiles.org',
};
const axios = require('axios');
const fs = require('fs');
const jsonFileReader = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, fileData) => {
            if (err) {
                return reject(err);
            }
            try {
                const object = JSON.parse(fileData);
                return resolve(object);
            }
            catch (err) {
                console.log('jsonFileReader', err);
                return reject(null);
            }
        });
    });
});
const jsonFileWriter = (filePath, data) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, JSON.stringify(data), 'utf8', function (err) {
            if (err) {
                console.log('jsonFileWriter', err);
                reject(err);
            }
            else
                resolve();
        });
    });
});
class BlockchainScanner {
    constructor(options) {
        this.options = defaultOptions;
        this.filterParams = {};
        this.started = false;
        this.nextHeight_ = 0;
        this.connectBlocksStarted = false;
        this.options = Object.assign({}, this.options, options);
        this.nextHeight_ = options && options.initHeight ? options.initHeight : 0;
        this.blockIntervalTimer = null;
        this.debug = options && options.debug ? options.debug : false;
        this.fromMempool = true;
        if (options && options.fromMempool === false) {
            this.fromMempool = false;
        }
        this.fromBlocks = true;
        if (options && options.fromBlocks === false) {
            this.fromBlocks = false;
        }
        // legacy. todo remove soon
        if (this.onlyblocks) {
            this.fromMempool = false;
            this.fromBlocks = true;
        }
        this.id = options && options.id ? options.id : '';
        this.saveUpdatedHeight = options && options.saveUpdatedHeight ? true : false;
        this.saveHeightPath = options && options.saveHeightPath ? options.saveHeightPath : `./bitcoinfiles_scanner_${this.getId()}.json`;
    }
    getId() {
        return this.id;
    }
    loadSavedHeight() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.saveUpdatedHeight) {
                return;
            }
            yield jsonFileReader(this.saveHeightPath)
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                if (data) {
                    this.nextHeight_ = data['nextHeight'];
                    return;
                }
                else {
                    yield jsonFileWriter(this.saveHeightPath, { nextHeight: this.nextHeight_ });
                }
            })).catch((error) => {
                // Create the file if it does not exist
                if (error.errno === -2) {
                    jsonFileWriter(this.saveHeightPath, { nextHeight: this.nextHeight_ });
                }
                else {
                    console.log('loadSavedHeight', error);
                }
            });
        });
    }
    nextHeight() {
        return this.nextHeight_;
    }
    ;
    incrementNextHeight() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.saveUpdatedHeight) {
                yield jsonFileWriter(this.saveHeightPath, { nextHeight: this.nextHeight_ + 1 });
            }
            this.nextHeight_ += 1;
            if (this.debug) {
                console.log('incrementNextHeight', this.nextHeight_);
            }
        });
    }
    ;
    filter(params) {
        this.filterParams = {
            baseFilter: params.baseFilter,
            outputFilter: params.outputFilter,
            outputFilterId: params.outputFilterId
        };
        if (this.started) {
            if (this.fromMempool) {
                if (this.debug) {
                    console.log('filter updated, reconnecting mempool');
                }
                this.reconnectMempoolSafe();
            }
        }
        return this;
    }
    ;
    mempool(fn) {
        this.mempoolHandler = fn;
        return this;
    }
    ;
    block(fn) {
        this.blockHandler = fn;
        return this;
    }
    error(fn) {
        this.errorHandler = fn;
        return this;
    }
    replayLastBlock() {
        this.nextHeight_ -= 1;
    }
    start(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug) {
                console.log('start');
            }
            if (this.started) {
                if (this.debug) {
                    console.log('already started');
                }
                if (fn) {
                    fn(this);
                }
                return true;
            }
            if (this.debug) {
                console.log('starting...');
            }
            if (this.fromMempool) {
                if (this.debug) {
                    console.log('connecting mempool...');
                }
                yield this.connectMempool();
                if (this.debug) {
                    console.log('Mempool connected...');
                }
            }
            if (this.fromBlocks) {
                this.connectBlocksStarted = true;
                if (this.debug) {
                    console.log('loading saved height...');
                }
                yield this.loadSavedHeight();
                if (this.debug) {
                    console.log('connecting blocks...');
                }
                yield this.connectBlocks();
                if (this.debug) {
                    console.log('Blocks connected...');
                }
            }
            this.started = true;
            if (fn) {
                fn(this);
            }
            return this;
        });
    }
    stop(fn) {
        if (this.debug) {
            console.log('stopping...');
        }
        this.disconnectMempool();
        this.disconnectBlocks();
        this.started = false;
        if (this.debug) {
            console.log('stopped');
        }
        if (fn) {
            fn(this);
        }
    }
    // Reconnect the mempool in 2 stages
    // This is done so we do not lose transactions we are monitoring
    reconnectMempoolSafe() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectSecondaryMempool();
            this.disconnectMempool();
            yield this.connectMempool();
            this.disconnectSecondaryMempool();
        });
    }
    disconnectMempool() {
        if (this.mempoolConnectionEventSource) {
            this.mempoolConnectionEventSource.close();
            this.mempoolConnectionEventSource = null;
        }
        return true;
    }
    disconnectSecondaryMempool() {
        if (this.mempoolSecondaryConnectionEventSource) {
            this.mempoolSecondaryConnectionEventSource.close();
            this.mempoolSecondaryConnectionEventSource = null;
        }
        return true;
    }
    connectSecondaryMempool() {
        return __awaiter(this, void 0, void 0, function* () {
            const connUrl = this.getMempoolUrl();
            if (this.debug) {
                console.log('connectSecondaryMempool connUrl', connUrl);
            }
            this.mempoolSecondaryConnectionEventSource = new EventSource(connUrl);
            this.mempoolSecondaryConnectionEventSource.onmessage = (event) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (this.debug) {
                        console.log('mempoolSecondaryConnectionEventSource event', event);
                    }
                    if (event.type === 'message') {
                        const parsedPayload = JSON.parse(event.data);
                        if (parsedPayload.type === 'tx') {
                            this.triggerMempool(parsedPayload);
                        }
                    }
                }
                catch (error) {
                    this.triggerError(error);
                }
            });
            this.mempoolSecondaryConnectionEventSource.onerror = function (err) {
                if (this.debug) {
                    console.log('mempoolSecondaryConnectionEventSource onerror', err);
                }
            };
            return true;
        });
    }
    connectMempool() {
        return __awaiter(this, void 0, void 0, function* () {
            const connUrl = this.getMempoolUrl();
            if (this.debug) {
                console.log('connectMempool connUrl', connUrl);
            }
            this.mempoolConnectionEventSource = new EventSource(connUrl);
            this.mempoolConnectionEventSource.onmessage = (event) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (this.debug) {
                        console.log('mempoolConnectionEventSource event', event);
                    }
                    if (event.type === 'message') {
                        const parsedPayload = JSON.parse(event.data);
                        if (parsedPayload.type === 'tx') {
                            this.triggerMempool(parsedPayload);
                        }
                    }
                }
                catch (error) {
                    this.triggerError(error);
                }
            });
            this.mempoolConnectionEventSource.onerror = function (err) {
                if (this.debug) {
                    console.log('mempoolConnectionEventSource onerror', err);
                }
            };
            return true;
        });
    }
    getFilterUrlQuery() {
        let url = '';
        if (this.filterParams['baseFilter']) {
            url += '/' + this.filterParams['baseFilter'];
        }
        url += '?';
        if (this.filterParams['outputFilterId']) {
            url += 'outputFilterId=' + this.filterParams['outputFilterId'];
            return url;
        }
        if (this.filterParams['outputFilter']) {
            if (!Array.isArray(this.filterParams['outputFilter'])) {
                throw new Error('invalid argument. outputFilter must be an array');
            }
            if (this.filterParams['outputFilter'].length > 20) {
                throw new Error('invalid argument. outputFilter must not contain more than 20 elements. use outputFilterId instead');
            }
            url += 'outputFilter=' + this.filterParams['outputFilter'].join(',');
            return url;
        }
        return url;
    }
    getMempoolUrl() {
        return this.options.stream_base + '/mempool/filter' + this.getFilterUrlQuery();
    }
    getBlockUrl(blockhash) {
        return this.options.media_base + '/block/' + blockhash + '/tx/filter' + this.getFilterUrlQuery();
    }
    disconnectBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connectBlocksStarted = false;
        });
    }
    connectBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.connectBlocksStarted) {
                let blockhash = null;
                try {
                    blockhash = yield this.getBlockhashByHeight(this.nextHeight());
                    if (this.debug) {
                        console.log('connectBlocks blockhash', blockhash);
                    }
                }
                catch (ex) {
                    if (ex && ex.response && ex.response.status === 404) {
                    }
                    else {
                        this.triggerError(ex);
                    }
                }
                let foundBlock = false;
                if (blockhash) {
                    yield axios.get(this.getBlockUrl(blockhash)).then((response) => __awaiter(this, void 0, void 0, function* () {
                        this.triggerBlock(response.data);
                        foundBlock = true;
                        yield this.incrementNextHeight();
                    })).catch((ex) => {
                        // 404 means we reached the tip.
                        // Todo: Add re-org protection later by tracking the last N blockhashes
                        if (ex && ex.response && ex.response.status === 404) {
                            return;
                        }
                        this.triggerError(ex);
                    });
                }
                if (!blockhash || !foundBlock) {
                    if (this.debug) {
                        console.log('Next block not found. Sleeping....');
                    }
                    yield this.sleep(10);
                }
            }
        });
    }
    getBlockhashByHeight(height) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios.get(this.options.media_base + `/height/${height}`).then((response) => {
                return response.data.blockhash;
            }).catch((ex) => {
                if (ex && ex.response && ex.response.status === 404) {
                    return null;
                }
                console.log('getBlockhashByHeight', ex);
            });
        });
    }
    sleep(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve();
                }, seconds * 1000);
            });
        });
    }
    triggerMempool(tx) {
        if (this.debug) {
            console.log('triggerMempool', tx.h);
        }
        if (this.mempoolHandler) {
            this.mempoolHandler(tx, this);
        }
    }
    triggerBlock(block) {
        if (this.debug) {
            console.log('triggerBlock', block.header);
        }
        if (this.blockHandler) {
            this.blockHandler(block, this);
        }
    }
    triggerError(err) {
        if (this.debug) {
            console.log('triggerError', err);
        }
        if (this.errorHandler) {
            this.errorHandler(err, this);
        }
    }
}
exports.BlockchainScanner = BlockchainScanner;
