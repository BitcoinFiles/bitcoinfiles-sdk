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

describe('coinbase', () => {
    xit('track all coinbases', async () => {
        var Mnemonic = require('bsv/mnemonic')
        var mnemonic = Mnemonic.fromString('');
        var hdPrivateKey = bsv.HDPrivateKey.fromSeed(mnemonic.toSeed());
        console.log(hdPrivateKey.toString())
        const derivePath = `m/44'/0'/0'/0/0`;
        const child = hdPrivateKey.deriveChild(derivePath);
        console.log('child', child);
        // var hdPrivateKey = mnemonic.toHDPrivateKey()
        console.log(hdPrivateKey.toString())
        let hdPublicKey = bsv.HDPublicKey.fromHDPrivateKey(hdPrivateKey)
        console.log(hdPublicKey)
        /*const daemonurl = "http://user:pass@host:8332";
        let startHeight = 622409;
        let maxHeight = 643566;
        let height = startHeight
        while (height <= maxHeight) {
            const response = await axios.post(daemonurl, {
                method: "getblockbyheight",
                params: [ height, 3 ]
            });

            const firstTx = response.data.result.tx[0];
            const coinbase = firstTx.vin[0].coinbase;

            const decodedCoinbase = Buffer.from(coinbase, 'hex').toString('utf8');
            console.log('block', height);
            console.log('decodedCoinbase', decodedCoinbase);
            console.log('coinbase', coinbase);
            if (/boostpow/i.test(decodedCoinbase)) {
                throw new Error('Found boost matching: ' + decodedCoinbase);
            }
            height++;
        }*/
    });
});

