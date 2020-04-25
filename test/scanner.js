'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var axios = require('axios');
var bsv = require('bsv');

const options = {
    // api_base: 'http://localhost:8082',
    // media_base: 'http://localhost:8082',
    // stream_base: 'http://localhost:8083',
}

describe('scanner', () => {
    it('Can query for blockchain info', async () => {
        /*
        const crawler = await index.scanner({
            initHeight: 632051,
        })
        .filter({
            outputFilter: ['1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf']
        })
        .mempool(function(e, self){
            const tx = new bsv.Transaction(e.raw);
            // console.log('mempool', tx.hash);
        })
        .block((block, self) => {
            for (const e of block.tx) {
                const tx = new bsv.Transaction(e.raw);
                console.log('blocktx', block.header.hash, tx.hash);
            }
        })
        .error((err, self) => {
            console.log('error', err.toString(), self);
        })

        // Uncomment to start
        .start();*/
    });
});

