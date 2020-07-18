'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

const options = {
    api_base: 'http://localhost:8082',
    media_base: 'http://localhost:8082',
    // stream_base: 'http://localhost:8083',
}


describe('scratchpad', () => {
    xit('scratch', async () => {

        function getScriptHash(scriptHex) {
            const buffer = Buffer.from(scriptHex, 'hex');
            return bsv.crypto.Hash.sha256(buffer).reverse().toString('hex');
        }
        const tx = new bsv.Transaction();
        tx.to('mqDyaVoJ7PPK1qDucLrz8C6YBwGAobobmh', 4000);
        console.log('tx', tx.toObject());
        // Take script  in output and generate scripthash
        console.log('script', tx.outputs[0].script);
        console.log('script hex', tx.outputs[0].script.toHex());
        // script hex: 76a9146a7b4205faf78aee54d015d65598eccd5401408888ac
        const scriptHash = getScriptHash(tx.outputs[0].script.toHex());
        console.log(scriptHash);
    })
});

