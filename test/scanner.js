'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var axios = require('axios');
var bsv = require('bsv');

const options = {
    // api_base: 'http://localhost:8082',
    // media_base: 'http://localhost:8082',
    stream_base: 'http://localhost:8080',
}

describe('scanner', () => {

    it('Can scan test', async () => {
        index.scanner({
            initHeight: 648998, // Start crawling at this height
            time: 1597960758, // Will return  missed tx's in mempool after this time (if still in cache)
            saveUpdatedHeight: true, // Save last height to file on disk
            fromMempool: true,
            fromBlocks: false,
            debug: true,
            ...options
        })
        .filter({
            baseFilter: '123',
            outputFilter: null,
            outputFilterId: null,
        })
        .mempool(function (e, self) {
        const tx = new bsv.Transaction(e.raw);
            // Do something with the transaction...
            console.log(tx);
        })
        .block((block, self) => {
            for (const e of block.tx) {
                const tx = new bsv.Transaction(e.raw);
                // Do something with the transaction...
                console.log(tx);
            }
        })
        .error((err, self) => {
            console.log(err);
        })
        .start();
        console.log('started....scanner');
     });
});

