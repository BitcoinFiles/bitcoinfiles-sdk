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
    it('Can get txs', async () => {
       const crawler = await index.scanner({
            saveUpdatedHeight: true,
            id: 'main2',
            debug: true,
            fromMempool: true,
            fromBlocks: true,
            ...options
        })
        .filter({
            baseFilter: '00123',
            // outputFilter: ['1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf']
        })
        .mempool(function(e, self){
            const tx = new bsv.Transaction(e.raw);
            console.log('mempool', tx.hash);
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
        .start();
        console.log('started....scanner');

		const saveResult1 = await index.instance().saveOutputFilter([
            "1FQxPex26ZTZZfr8j4Km1jTcBmx7nSHf11",
        ]);
        const saveResult2 = await index.instance().saveOutputFilter([
            "1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf",
        ]);
        let lastOutputFilterId1 = saveResult1.result.id;
        let lastOutputFilterId2 = saveResult2.result.id;

        setTimeout(() => {
            console.log('set timeout', lastOutputFilterId1);
            crawler.filter({
                baseFilter: null,
                outputFilter: null,
                outputFilterId: lastOutputFilterId1,
            });
            setTimeout(() => {
                console.log('set timeout 2', lastOutputFilterId2);
                crawler.filter({
                    baseFilter: null,
                    outputFilter: null,
                    outputFilterId: lastOutputFilterId2,
                });
            }, 17000);
        }, 1000);

    });
});

