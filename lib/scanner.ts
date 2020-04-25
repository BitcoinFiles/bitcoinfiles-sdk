
const EventSource = require('eventsource');
const defaultOptions = {
    api_base: 'https://api.bitcoinfiles.org',
    media_base: 'https://media.bitcoinfiles.org',
    stream_base: 'https://stream.bitcoinfiles.org',
}
const axios = require('axios');

export class BlockchainScanner {
    options = defaultOptions;
    filterParams: any = {};
    started = false;
    mempoolConnectionEventSource;
    mempoolSecondaryConnectionEventSource;
    nextHeight_ = 0;

    mempoolHandler;
    blockHandler;
    errorHandler;
    blockIntervalTimer;

    constructor(options?: {
        initHeight: number
    }) {
        this.options = Object.assign({}, this.options, options);
        this.nextHeight_ = options && options.initHeight ? options.initHeight : 0;
        this.blockIntervalTimer = null;
    }

    nextHeight() {
       return this.nextHeight_;
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
            this.reconnectMempoolSafe();
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
        if (this.started) {
            if (fn) {
                fn(this);
            }
            return true;
        }
        this.started = true;
        this.connectMempool();
        this.connectBlocks();
        if (fn) {
            fn(this);
        }
        return this;
    }

    stop(fn?: Function) {
        this.started = false;
        this.disconnectMempool();
        this.disconnectBlocks();

        if (fn) {
            fn(this);
        }
    }

    private async reconnectMempoolSafe() {
        await this.connectSecondaryMempool();
        this.disconnectMempool();
        await this.connectMempool();
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
        this.mempoolSecondaryConnectionEventSource = new EventSource(this.getMempoolUrl());
        this.mempoolSecondaryConnectionEventSource.onmessage = async (event) => {
            try {
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

        return true;
    }

    private async connectMempool() {
        this.mempoolConnectionEventSource = new EventSource(this.getMempoolUrl());
        this.mempoolConnectionEventSource.onmessage = async (event) => {
            try {
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
        return this.options.stream_base + '/mempool/filter' + this.getFilterUrlQuery();
    }

    private getBlockUrl(blockhash) {
        return this.options.media_base + '/block/' + blockhash + '/tx/filter' + this.getFilterUrlQuery();
    }

    private async disconnectBlocks() {
        // Nothing to do for now
       return true;
    }

    private async connectBlocks() {
        while (this.started) {
            let blockhash = null;
            try {
                blockhash = await this.getBlockhashByHeight(this.nextHeight());
            } catch (ex) {
                if (ex && ex.response && ex.response.status === 404) {
                } else {
                    this.triggerError(ex);
                }
            }
            let foundBlock = false;
            if (blockhash) {
                await axios.get(this.getBlockUrl(blockhash)).then((response) => {
                    this.triggerBlock(response.data);
                    foundBlock = true;
                    this.nextHeight_ += 1;
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
                await this.sleep(10);
            }
        }
    }

    private async getBlockhashByHeight(height) {
        return await axios.get(this.options.media_base + `/height/${height}`).then((response) => {
            return response.data.blockhash;
        }).catch((ex) => {
            return ex;
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
        if (this.mempoolHandler) {
            this.mempoolHandler(tx, this);
        }
    }

    private triggerBlock(block: any) {
        if (this.blockHandler) {
            this.blockHandler(block, this);
        }
    }

    private triggerError(err: any) {
        if (this.errorHandler) {
            this.errorHandler(err, this);
        }
    }
}