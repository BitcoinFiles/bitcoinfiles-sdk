'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

const options = {
    api_base: 'http://localhost:8082',
    media_base: 'http://localhost:8082',
    // stream_base: 'http://localhost:8083',
}

describe('proofs', () => {
    it('Can handle a tx with no merkle proof found', async () => {
        var bf = index.instance(options);
        try {
            await bf.getTxOutProof('133fc9e55db4039d5b48df8aab31cd2366d98d64285fdc2aa53c17aa895b476e');
        } catch (err) {
            expect(err).to.eql({
                "code": 404,
                "error": "Error: Transaction not yet in block",
                "message": "Error: Transaction not yet in block",
                "success": false,
            });
        }
    })
    it('Can query for tx out proof', async () => {
        var bf = index.instance(options);
        const result = await bf.getTxOutProof('633fc9e55db4039d5b48df8aab31cd2366d98d64285fdc2aa53c17aa895b476e');
        expect(result).to.eql({ header:
            { hash:
               '00000000000000000058a72020a7e2516fec66c68aa69af7705cf1bf7999d52a',
              version: 805298176,
              prevHash:
               '00000000000000000262c4644f5db9c538beba05977292cf7528487867606e09',
              merkleRoot:
               'b3b5b72ef772031100bf7fa2b127b03c7d1781470e9a4ab06810748c28308546',
              time: 1585087173,
              bits: 402817249,
              nonce: 2141978759 },
           numTransactions: 3832,
           hashes:
            [ 'dc354e48d853115252d7a335b6ee1bbab6a48d1b0c8a5bb6883534e280f89e2d',
              '9a7bf479539b5b54cb7fe1685da7b221ba2be5b1a6c56afa8ff4dd0589f6c4f0',
              '8475e9bdbf61a0cf4dadb7bab5e1394c8915bea1f7b7c2bb77b5da998b0337e2',
              '9ec618cccb695d12db0cc1e8333505dde114a45f68b1bebdfb24ca811dc585d3',
              'b212587785c188d31efa131b7907def98bd906da38e7932277ce4a14cd67a6cd',
              '1b122a236404667c363c74f61b27a6fe6fcfc6e6659b2cdb586b8300da695a85',
              '6e475b89aa173ca52adc5f28648dd96623cd31ab8adf485b9d03b45de5c93f63',
              'ed872554fd217fab7f799c879b9b1610384d7f3e528c5c25d9b305e0e63c242f',
              '633e5df804321bd23cf99591fd99f0861c3432b83b4d43b2c5d4fc95dc58e559',
              'c5d11b83695bed3b8a697d7e880ef8003385dd8f20c44eaaa5820c5fbef4b9ed',
              '060ea37dec8ce3efddafec62d95c5985741d0b4dbca1a525b09e1a3c834bb232',
              '62dbb6230742d8748f7edc8de91b18fc6f4295612c8f337bfc6ed1037358bf65',
              'e152f84db22309d316491c5bf344ff907c6a0e5af1c003f2fa7d4a8917b39f88' ],
           flags: [ 181, 250, 5, 0 ] });
    });

    it('Can query for raw tx out proof and validate it', async () => {
        var bf = index.instance(options);
        const result = await bf.getTxOutProofString('633fc9e55db4039d5b48df8aab31cd2366d98d64285fdc2aa53c17aa895b476e');
        expect(result).to.eql('00e0ff2f096e606778482875cf92729705babe38c5b95d4f64c462020000000000000000468530288c741068b04a9a0e4781177d3cb027b1a27fbf00110372f72eb7b5b3c5827a5ee18002188700ac7ff80e00000ddc354e48d853115252d7a335b6ee1bbab6a48d1b0c8a5bb6883534e280f89e2d9a7bf479539b5b54cb7fe1685da7b221ba2be5b1a6c56afa8ff4dd0589f6c4f08475e9bdbf61a0cf4dadb7bab5e1394c8915bea1f7b7c2bb77b5da998b0337e29ec618cccb695d12db0cc1e8333505dde114a45f68b1bebdfb24ca811dc585d3b212587785c188d31efa131b7907def98bd906da38e7932277ce4a14cd67a6cd1b122a236404667c363c74f61b27a6fe6fcfc6e6659b2cdb586b8300da695a856e475b89aa173ca52adc5f28648dd96623cd31ab8adf485b9d03b45de5c93f63ed872554fd217fab7f799c879b9b1610384d7f3e528c5c25d9b305e0e63c242f633e5df804321bd23cf99591fd99f0861c3432b83b4d43b2c5d4fc95dc58e559c5d11b83695bed3b8a697d7e880ef8003385dd8f20c44eaaa5820c5fbef4b9ed060ea37dec8ce3efddafec62d95c5985741d0b4dbca1a525b09e1a3c834bb23262dbb6230742d8748f7edc8de91b18fc6f4295612c8f337bfc6ed1037358bf65e152f84db22309d316491c5bf344ff907c6a0e5af1c003f2fa7d4a8917b39f8804b5fa0500');
        const validated = await bf.verifyTxOutProofString(result);
        expect(validated).to.eql([
            '633fc9e55db4039d5b48df8aab31cd2366d98d64285fdc2aa53c17aa895b476e'
        ]);
    });
});

