'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');
// Do not use this to send money!
// You will lose your bitcoin!
// This is here for testing purposes only
const privateKey = 'L31717p4nUc2e95Vo3urCVML8N4hKuWbivmbpd3EwusqmtvVVL2E';

function sleep(n) { return new Promise(resolve=>setTimeout(resolve,n)); }

describe('uploads', () => {
    it('should return false no key', async () => {
        var createRequest = {
            file: {
            },
            pay: {
                key: ""
            }
        };

        var result = await index.createFile(createRequest);
        expect(result).to.eql({
            success: false,
            message: "key required"
        });

        createRequest = {
            file: {

            },
            pay: {
                key: undefined
            }
        };

        var result = await index.createFile(createRequest);
        expect(result).to.eql({
            success: false,
            message: "key required"
        });
    });

    it('should return false missing file', async () => {
        var createRequest = {
            pay: {
                key: "key1"
            }
        };

        var result = await index.createFile(createRequest);
        expect(result).to.eql({
            success: false,
            message: "file required"
        });

    });

    it('should return false missing file callback', async () => {
        var createRequest = {
            pay: {
                key: "key1"
            }
        };

        await index.createFile(createRequest, (result) => {
            expect(result).to.eql({
                success: false,
                message: "file required"
            });
        });
    });

    it('should return false missing file content', async () => {
        var createRequest = {
            file: {

            },
            pay: {
                key: "key1"
            }
        };

        var result = await index.createFile(createRequest);
        expect(result).to.eql({
            success: false,
            message: "content required"
        });

    });

    it('should return false missing file contentType', async () => {
        var createRequest = {
            file: {
                content: 'hello',
            },
            pay: {
                key: "key1"
            }
        };

        var result = await index.createFile(createRequest);
        expect(result).to.eql({
            success: false,
            message: "contentType required"
        });
    });

    // Uncomment this line to send a real transaction
    it('uploadnow should return success created file utf-8 default', async () => {
        await sleep(6000);
        var createRequest = {
            file: {
                content: 'hello',
                contentType: 'text/plain',
            },
            pay: {
                key: privateKey
            },
            signatures: [
                {
                    key: privateKey
                }
            ]
        };
        const address = new bsv.PrivateKey(privateKey).toPublicKey().toAddress().toString();
        const result = await index.createFile(createRequest, function(status) {
            expect(!!status.fee).to.equal(true);
            expect(!!status.rawtx).to.equal(true);
        });
        // Check that the signature can be verified
       /* const expectedSigned1 = [
            '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
            '0x68656c6c6f',
            '0x746578742f706c61696e',
            '0x7574662d38',
            '0x00',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1c654ddcf92e71de7a2221d831ef7bd705e94ee0f8f4b4a62916047e13e1448a836f18f25136001a67be9474ea1e56ed7fda9e309660d4b84660999f047cd8f38f',
            '0x9467df677dc153a88243465d09ca5fe8f7ba8cf9'
        ];
        // Let's verify the signature explictly
        // (It was already verified underneath in building it, but we check again for demo purposes)
        var detectAddressesResult = await index.detectAndVerifyAuthorIdentities(expectedSigned1);
        expect(detectAddressesResult).to.eql({

            const expectedSigned1 = [
            '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
            '0x68656c6c6f',
            '0x746578742f706c61696e',
            '0x7574662d38',
            '0x00',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1c654ddcf92e71de7a2221d831ef7bd705e94ee0f8f4b4a62916047e13e1448a836f18f25136001a67be9474ea1e56ed7fda9e309660d4b84660999f047cd8f38f',
            '0x9467df677dc153a88243465d09ca5fe8f7ba8cf9'
        ];

        });*/
        //const s = new bsv.Script.fromHex('006a2231394878696756345179427633744870515663554551797131707a5a56646f4175740568656c6c6f0a746578742f706c61696e057574662d380100017c22313550636948473232534e4c514a584d6f53556157566937575371633768436676610d424954434f494e5f45434453412231336a62683650733670344745664e56625a7070364177715746726b57516d61574e411f7338b68ba98edd91d6151bb6baa17885d4827a35ccfa5e76da7e1df8d8124de37b2c48d129f5c08fd682dfe6ed491dcc4feba5c90af4770fc9bab3afd5d2caed');
        // Now verify by the tx that was created earlier
        var detectAddressesResult = await index.detectAndVerifyAuthorIdentitiesByTx(result.rawtx); // '0100000001f192415cc32c7245f1e6e395760be00a7283c5f203acb4fce7824803740e301f010000008a47304402205e3c84c089e90c7efa4d1d7aeccca2989ef82237e7b8b161112cd72e93d6b1200220129a4f1c4450fdcdba61ca1a765845b8c426e80e6660c1ccaae594bf56661dc04141043cf0a503fd150ad112de4503f7dd17dcdba99e41cd7f8b52315fa1a4f9e499b9493fddcc15a594022f9734b8cf12a068d51328664192f351c3b618e52ae1f85fffffffff020000000000000000d6006a2231394878696756345179427633744870515663554551797131707a5a56646f4175740568656c6c6f0a746578742f706c61696e057574662d380100017c22313550636948473232534e4c514a584d6f53556157566937575371633768436676610d424954434f494e5f45434453412231455868536247466945415a4345356565427655785436634256486872705057587a411c654ddcf92e71de7a2221d831ef7bd705e94ee0f8f4b4a62916047e13e1448a836f18f25136001a67be9474ea1e56ed7fda9e309660d4b84660999f047cd8f38f87560700000000001976a9149467df677dc153a88243465d09ca5fe8f7ba8cf988ac00000000');
        console.log(detectAddressesResult);
        expect(detectAddressesResult).to.eql({
            "0": {
                "addresses": [
                  {
                    "address": "13jbh6Ps6p4GEfNVbZpp6AwqWFrkWQmaWN",
                    "fieldIndexesForSignature": [
                      0,
                      1,
                      2,
                      3,
                      4,
                      5,
                      6,
                    ],
                    "pos": 7,
                    "verified": true,
                  }
                ],
                "signedFullyByAddresses": [
                  "13jbh6Ps6p4GEfNVbZpp6AwqWFrkWQmaWN"
                ],
                "verified": true
              }
        });
    });


    // Uncomment this line to send a real transaction

    it('should return success created file utf-8 and signs it with a public key', async () => {
        await sleep(6000);
        var createRequest = {
            file: {
                content: 'Hello world!',
                contentType: 'text/plain',
            },
            pay: {
                key: privateKey
            },
            signatures: [
                {
                    key: privateKey
                }
            ]
        };
        var result = await index.createFile(createRequest);
        expect(result.success).to.equal(true);
    });


    // Uncomment this line to send a real transaction

    it('should return success created file utf-8 default', async () => {
        await sleep(6000);
        var createRequest = {
            file: {
                content: JSON.stringify({ foo: "bar" }),
                contentType: 'application/json',
                encoding: 'utf8',
                name: 'file.json',
                tags: ['tag99', 'https://www.bitcoinfiles.org#super-%24-$422-9/#', 'some other tag', '4thtag', '5th element']
            },
            pay: {
                key: privateKey
            }
        };

        var result = await index.createFile(createRequest);
        expect(result.success).to.equal(true);
    });

});