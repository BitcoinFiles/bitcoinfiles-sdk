
const EventSource = require('eventsource');
const defaultOptions = {
    api_base: 'https://api.bitcoinfiles.org',
    media_base: 'https://media.bitcoinfiles.org',
    stream_base: 'https://stream.bitcoinfiles.org',
}
const axios = require('axios');
const fs = require('fs');

const jsonFileReader = async (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          return reject(err);
        }
        try {
            const object = JSON.parse(fileData)
            return resolve(object);
        } catch(err) {
          console.log('jsonFileReader', err);
          return reject(null);
        }
      })
    });
}

const jsonFileWriter = async (filePath, data) => {
    return new Promise(function(resolve, reject) {
        fs.writeFile(filePath, JSON.stringify(data), 'utf8', function(err) {
            if (err){
                console.log('jsonFileWriter', err);
                reject(err);
            }
            else resolve();
        });
    })
};

export class BlockchainScanner {
    options = defaultOptions;
    filterParams: any = {};
    started = false;
    mempoolConnectionEventSource;
    mempoolSecondaryConnectionEventSource;
    nextHeight_ = 0;
    saveHeightPath;
    saveUpdatedHeight;
    mempoolHandler;
    blockHandler;
    errorHandler;
    blockIntervalTimer;
    id;
    time;
    debug;
    fromMempool;
    fromBlocks;
    onlyblocks;
    processConnectBlocks = false;
    constructor(options?: {
        initHeight: number,
        saveUpdatedHeight?: boolean,
        saveHeightPath?: string,
        id?: string,
        debug?: boolean,
        fromMempool?: boolean,
        fromBlocks?: boolean,
        time?: number,
    }) {
        this.options = Object.assign({}, this.options, options);
        this.nextHeight_ = options && options.initHeight ? options.initHeight : 638731;
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
        this.time = options && options.time ? options.time : undefined;
        this.id = options && options.id ? options.id : '';
        this.saveUpdatedHeight = options && options.saveUpdatedHeight ? true : false;
        this.saveHeightPath = options && options.saveHeightPath ? options.saveHeightPath : `./bitcoinfiles_scanner_${this.getId()}.json`;
        // Start the timer loop for blocks
        this.connectBlocks();
    }

    getId(): string {
        return this.id;
    }

    async loadSavedHeight() {
        if (!this.saveUpdatedHeight) {
            return;
        }
        await jsonFileReader(this.saveHeightPath)
        .then(async (data: any) => {
            if (data) {
                this.nextHeight_ = data['nextHeight'];
                return;
            } else {
                await jsonFileWriter(this.saveHeightPath, { nextHeight: this.nextHeight_ });
            }
        }).catch((error) => {
            // Create the file if it does not exist
            if (error.errno === -2) {
                jsonFileWriter(this.saveHeightPath, { nextHeight: this.nextHeight_ });
            } else {
                console.log('loadSavedHeight', error);
            }
        });
    }

    nextHeight() {
       return this.nextHeight_;
    };

    async incrementNextHeight() {
        if (this.saveUpdatedHeight) {
            await jsonFileWriter(this.saveHeightPath, { nextHeight: this.nextHeight_ + 1 });
        }
        this.nextHeight_ += 1;
        if (this.debug) {
            console.log('incrementNextHeight', this.nextHeight_);
        }
    };

    filter(params: {
        baseFilter?: string,
        outputFilter?: string[],
        outputFilterId?: string,
    }) {
        this.filterParams = {
            baseFilter: params.baseFilter,
            outputFilter: params.outputFilter,
            outputFilterId: params.outputFilterId
        }

        if (this.started) {
            if (this.fromMempool) {
                if (this.debug) {
                    console.log('filter updated, reconnecting mempool');
                }
                this.reconnectMempoolSafe();
            }
        }
        return this;
    };

    mempool(fn: Function) {
        this.mempoolHandler = fn;

        return this;
    };

    block(fn: Function) {
        this.blockHandler = fn;

        return this;
    }

    error(fn: Function) {
        this.errorHandler = fn;
        return this;
    }

    replayLastBlock() {
        this.nextHeight_ -= 1;
    }

    async start(fn?: Function) {
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
        this.started = true;

        if (this.fromMempool) {
            if (this.debug) {
                console.log('connecting mempool...');
            }
            await this.connectMempool();
            if (this.debug) {
                console.log('Mempool connected...');
            }
        }

        if (this.fromBlocks) {
            this.processConnectBlocks = true;
            if (this.debug) {
                console.log('loading saved height...');
            }
            await this.loadSavedHeight();
            if (this.debug) {
                console.log('connecting blocks...');
            }
            if (this.debug) {
                console.log('Blocks connected...');
            }
        }

        if (fn) {
            fn(this);
        }
        return this;
    }

    stop(fn?: Function) {
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
    private async reconnectMempoolSafe() {
        await this.connectSecondaryMempool();
        await this.sleep(1);
        this.disconnectMempool();
        await this.connectMempool();
        await this.sleep(1);
        this.disconnectSecondaryMempool()
    }

    private disconnectMempool() {
        if (this.mempoolConnectionEventSource) {
            this.mempoolConnectionEventSource.close();
            this.mempoolConnectionEventSource = null;
        }
        return true;
    }

    private disconnectSecondaryMempool() {
        if (this.mempoolSecondaryConnectionEventSource) {
            this.mempoolSecondaryConnectionEventSource.close();
            this.mempoolSecondaryConnectionEventSource = null;
        }
        return true;
    }

    private async connectSecondaryMempool() {
        const connUrl = this.getMempoolUrl();

        if (this.debug) {
            console.log('connectSecondaryMempool connUrl', connUrl);
        }

        if (this.mempoolSecondaryConnectionEventSource) {
            this.mempoolSecondaryConnectionEventSource.close();
        }
        this.mempoolSecondaryConnectionEventSource = new EventSource(connUrl);
        this.mempoolSecondaryConnectionEventSource.onmessage = async (event) => {
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

            } catch (error) {
                this.triggerError(error);
            }
        }
        this.mempoolSecondaryConnectionEventSource.onerror = function(err) {
            if (this.debug) {
                console.log('mempoolSecondaryConnectionEventSource onerror', err);
            }
        };

        return true;
    }

    private async connectMempool() {
        const connUrl = this.getMempoolUrl();
        if (this.debug) {
            console.log('connectMempool connUrl', connUrl);
        }

        if (this.mempoolConnectionEventSource) {
            this.mempoolConnectionEventSource.close();
        }

        this.mempoolConnectionEventSource = new EventSource(connUrl);
        this.mempoolConnectionEventSource.onmessage = async (event) => {
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
            } catch (error) {
                this.triggerError(error);
            }
        };
        this.mempoolConnectionEventSource.onerror = function(err) {
            if (this.debug) {
                console.log('mempoolConnectionEventSource onerror', err);
            }
        };

        return true;
    }

    private getFilterUrlQuery() {
        let url = '';

        if (this.filterParams['baseFilter']) {
            url += '/' + this.filterParams['baseFilter']
        }
        url += '?';

        if (this.filterParams['outputFilterId']) {
            url += 'outputFilterId=' + this.filterParams['outputFilterId'];
            return url;
        }

        if (this.filterParams['outputFilter']) {
            if (!Array.isArray(this.filterParams['outputFilter'])) {
                throw new Error('invalid argument. outputFilter must be an array')
            }
            if (this.filterParams['outputFilter'].length > 20) {
                throw new Error('invalid argument. outputFilter must not contain more than 20 elements. use outputFilterId instead')
            }
            url += 'outputFilter=' + this.filterParams['outputFilter'].join(',');
            return url;
        }
        return url;
    }

    private getMempoolUrl() {
        let url = this.options.stream_base + '/mempool/filter' + this.getFilterUrlQuery();
        if (this.time) {
            url += '&time=' + this.time;
        }
        return url;
    }

    private getBlockUrl(blockhash) {
        return this.options.media_base + '/block/' + blockhash + '/tx/filter' + this.getFilterUrlQuery();
    }

    private async disconnectBlocks() {
       this.processConnectBlocks = false;
    }

    /**
     * Have a N=10 second timer to check for blocks
     */
    private async connectBlocks() {
        while (true) {
            try {
                // Skip processing. Finally block will retry
                if (!this.processConnectBlocks) {
                    continue;
                }
                let blockhash = null;
                try {
                    blockhash = await this.getBlockhashByHeight(this.nextHeight());
                    if (this.debug) {
                        console.log('connectBlocks blockhash', blockhash);
                    }
                } catch (ex) {
                    if (ex && ex.response && ex.response.status === 404) {
                    } else {
                        this.triggerError(ex);
                    }
                }
                let foundBlock = false;
                if (blockhash) {
                    await axios.get(this.getBlockUrl(blockhash)).then(async (response) => {
                        this.triggerBlock(response.data);
                        foundBlock = true;
                        await this.incrementNextHeight();
                    }).catch((ex) => {
                        // 404 means we reached the tip.
                        // Todo: Add re-org protection later by tracking the last N blockhashes
                        if (ex && ex.response && ex.response.status === 404) {
                            return;
                        }
                        this.triggerError(ex);
                    })
                }
                if (!blockhash || !foundBlock) {
                    if (this.debug) {
                        console.log('Next block not found. Sleeping....');
                    }
                }
            } finally {
                await this.sleep(10);
            }
        }
    }

    private async getBlockhashByHeight(height) {
        return await axios.get(this.options.media_base + `/height/${height}`).then((response) => {
            return response.data.blockhash;
        }).catch((ex) => {
            if (ex && ex.response && ex.response.status === 404) {
                return null
            }
            console.log('getBlockhashByHeight', ex);
        })
    }

    private async sleep(seconds) {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve();
            }, seconds * 1000);
        });
    }

    private triggerMempool(tx: any) {
        if (this.debug) {
            console.log('triggerMempool', tx.h);
        }
        if (this.mempoolHandler) {
            this.mempoolHandler(tx, this);
        }
    }

    private triggerBlock(block: any) {
        if (this.debug) {
            console.log('triggerBlock', block.header);
        }
        if (this.blockHandler) {
            this.blockHandler(block, this);
        }
    }

    private triggerError(err: any) {
        if (this.debug) {
            console.log('triggerError', err);
        }
        if (this.errorHandler) {
            this.errorHandler(err, this);
        }
    }
}