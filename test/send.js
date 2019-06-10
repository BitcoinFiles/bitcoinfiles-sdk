'use strict';
var expect = require('chai').expect;
var axios = require('axios')
var index = require('../dist/index.js');
var bsv = require('bsv');
const BITBOXSDK = require('bitbox-sdk');
const BITBOX = new BITBOXSDK();

describe('send function test', () => {

    it('should send txs', async () => {

        const rawtx = '01000000012ad543bf57024014458cf524385248b479d396709e511def541952b718111b91010000006b483045022100ed160167df04b7bd63ebdc4e48b43501ce789ef9a82849245ca2e6687a0306f602201097253115885d35e7d52c6fa7f2b77d6a063dd7c4fd5253eb093c53f577de454121020e7ab2251bb7b40fb25a84906577310de5c7e510ffa376492ccf3fa2e91deb2cffffffff02da940200000000001976a9148f881918cd3589d7ff585a0e8456fa48ea4fd30d88acac841200000000001976a91482a1a3c8458bed0a6cecbd7adcd39edfc11934d888ac00000000';
        const tx = new bsv.Transaction(rawtx);

        console.log('tx', tx.toJSON());

        // decode raw transaction hex
        await (async () => {
            try {
            let decodeRawTransaction = await BITBOX.RawTransactions.decodeRawTransaction(rawtx);
            console.log(JSON.stringify(decodeRawTransaction));
            } catch(error) {
            console.error(error)
        }})();

        const cb = '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1c03e8db082f7376706f6f6c2e636f6d2f0923a65738686a6ade010080ffffffff018419854a000000001976a914492558fb8ca71a3591316d095afc0f20ef7d42f788ac00000000';

        await (async () => {
            try {
            let decodeRawTransaction = await BITBOX.RawTransactions.decodeRawTransaction(cb);
            console.log(JSON.stringify(decodeRawTransaction));
            } catch(error) {
            console.error(error)
        }})();



    });

});