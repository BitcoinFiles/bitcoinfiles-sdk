import axios from 'axios';
declare var Buffer: any;

const defaultOptions = {
    bitcoinfiles_api_base: 'https://media.bitcoinfiles.org',
    api_key: '',
    onblock: function() {},
}

export class BlockCrawler {
    options = defaultOptions;
    constructor(options: any) {
        this.options = Object.assign({}, this.options, options);
    }
}