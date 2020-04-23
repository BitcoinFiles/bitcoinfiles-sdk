import axios from 'axios';
declare var Buffer: any;

const defaultOptions = {
    api_base: 'https://media.bitcoinfiles.org',
    onblock: function() {},
}

export class BlockCrawler {
    options = defaultOptions;
    mempoolHandlers: Function[] = [];
    blockHandlers: Function[] = [];
    constructor(options: any) {
        this.options = Object.assign({}, this.options, options);
    }

    on(event: 'mempool' | 'block', fn: Function) {
        if (event === 'mempool') {
            this.mempoolHandlers.push(fn);
        }
        if (event === 'block') {
            this.blockHandlers.push(fn);
        }
        throw new Error('invalid argument');
    };

    private triggerMempool(tx: any) {
        this.mempoolHandlers.forEach(function(item) {
            item(tx);
        });
    }

    private triggerBlock(block: any) {
        this.blockHandlers.forEach(function(item) {
            item(block);
        });
    }
}