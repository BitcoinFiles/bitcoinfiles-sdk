'use strict';
var expect = require('chai').expect;
var axios = require('axios')
var index = require('../dist/index.js');

describe('send function test', () => {

    // Utilities...nothing to see here
    /*
    it('should send txs', async () => {
        var result = await axios.get(
            'http://localhost:3000/api/v2/txs/mempool'
        ).then(async (response) => {
            for (const tx of response.data.data) {
                var fulltx = await axios.get(
                    'https://api.bitindex.network/api/v2/tx/' + tx
                ).then(async (fullTxResponse) => {
                    console.log('Found tx to check...', tx);
                    var result = await axios.get(
                        'https://dyn.bitcoinfiles.org/' + tx
                    ).then(async (response) => {
                        console.log('TX IS FOUND IN BITCOINFILES: ----------------- ', response.status);
                    }).catch(async (fail) => {
                        console.log('Not found, broadcasting', fail.status);
                        var result = await axios.post(
                            'https://api.bitindex.network/api/v2/tx/send',
                            {
                                rawtx: fullTxResponse.data.data.hex
                            },
                            {
                                headers: { 'content-type': 'application/json' }
                            },
                        ).then((broadcastResult) => {
                            console.log('broadcasted', broadcastResult.data);
                        }).finally((r) => {
                            console.log('err', r);
                        })
                    });
                });
            }
            console.log('done--');
        });
    });
    */
});