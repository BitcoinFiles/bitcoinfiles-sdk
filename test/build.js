'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

// Do not use this to send money!
// You will lose your bitcoin!
// This is here for testing purposes only
const privateKey = '5KLpZB2Sfn4S7QXh6rRynXrVZXXT8zTdQBaj7Ngs3ZHpip5zd8r';
const address = '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz';

const privateKey2 = '5Hy9zVymDHhavj55sRdQ5nWTYYeJ2BsJdFDpfPutcc7RZUJg59H';
const address2 = '19nknLhRnGKRR3hobeFuuqmHUMiNTKZHsR';

describe('buildFile function test', () => {

   it('should return success buildFile utf-8 and signs it with a public key', async () => {
        // buildFile request so we can inspect the resulting OP_RETURN field array
        // We can use it to feed it into create function directly and inspect
        var buildRequest = {
            file: {
                content: 'Hello world!',
                contentType: 'text/plain',
            },
            signatures: [
                {
                    key: privateKey
                }
            ]
        };
        // Build the actual field
        var result = await index.buildFile(buildRequest);
        // The request was successful
        expect(result.success).to.equal(true);
        // Inspect the response
        // Notice that the AUTHOR SIGNATURE protocol was added after the pipe '|' automatically
        const expectedSigned1 = [
            '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
            '0x48656c6c6f20776f726c6421',
            '0x746578742f706c61696e',
            '0x7574662d38',
            '0x00',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1cacee1dbe375e3e17a662b560944e0ff78dff9f194744fb2ee462d905bc785727420d5deed4b2dd019023f550af4f4f7934050179e217220592a41882f0251ef4',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05',
            '0x06'
        ];
        expect(result.data).to.eql(expectedSigned1);
        // Let's verify the signature explictly
        // (It was already verified underneath in building it, but we check again for demo purposes)
        var verifySigResult = await index.verifyAuthorIdentity(result.data, [address]);
        expect(verifySigResult.verified).to.equal(true);
        expect(verifySigResult.addresses).to.eql([
            {
                address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                ],
                pos: 7
            }
        ]);
    });

    it('should return success buildFile utf-8 and signs it with a public key with a filename', async () => {
        // buildFile request so we can inspect the resulting OP_RETURN field array
        // We can use it to feed it into create function directly and inspect
        var buildRequest = {
            file: {
                name: 'hello.txt',
                content: 'Hello world!',
                contentType: 'text/plain',
            },
            signatures: [
                {
                    key: privateKey
                }
            ]
        };
        // Build the actual field
        var result = await index.buildFile(buildRequest);
        // The request was successful
        expect(result.success).to.equal(true);
        // Inspect the response
        // Notice that the AUTHOR SIGNATURE protocol was added after the pipe '|' automatically
        const expectedSigned1 = [
            '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
            '0x48656c6c6f20776f726c6421',
            '0x746578742f706c61696e',
            '0x7574662d38',
            '0x68656c6c6f2e747874',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1caa0b465884a823dc98bd06690b57e092381ce4af670698ad9ef4b5c84eec0717384c134255db314b03b437690107cac45cb9b5d8cdafcabe1970a51ef34d8f85',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05',
            '0x06'
        ];
        expect(result.data).to.eql(expectedSigned1);
        // Let's verify the signature explictly
        // (It was already verified underneath in building it, but we check again for demo purposes)
        var verifySigResult = await index.verifyAuthorIdentity(result.data, [address]);
        expect(verifySigResult.verified).to.equal(true);
        expect(verifySigResult.addresses).to.eql([
            {
                address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                ],
                pos: 7
            }
        ]);
    });

    it('should return success buildFile utf-8 and sign it with the same public key twice', async () => {
        // buildFile request so we can inspect the resulting OP_RETURN field array
        // We can use it to feed it into create function directly and inspect
        var buildRequest = {
            file: {
                content: 'Hello world!',
                contentType: 'text/plain',
            },
            signatures: [
                {
                    key: privateKey
                },
                {
                    key: privateKey
                }
            ]
        };
        // Build the actual field
        var result = await index.buildFile(buildRequest);
        // The request was successful
        expect(result.success).to.equal(true);
        // Inspect the response
        // Notice that the AUTHOR SIGNATURE protocol was added after the pipe '|' automatically
        const expectedSigned1 = [
            '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
            '0x48656c6c6f20776f726c6421',
            '0x746578742f706c61696e',
            '0x7574662d38',
            '0x00',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1cacee1dbe375e3e17a662b560944e0ff78dff9f194744fb2ee462d905bc785727420d5deed4b2dd019023f550af4f4f7934050179e217220592a41882f0251ef4',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05',
            '0x06',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1c4750252ccd7f5455886e0f8fb914ca3918dd092ea66ab79528d793ce54063b8001c17230efcca9deb3e39a8fb80124e2347f37503bff486a1a6dabefdcb7cb07',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05',
            '0x06',
            '0x07',
            '0x08',
            '0x09',
            '0x0a',
            '0x0b',
            '0x0c',
            '0x0d',
            '0x0e',
            '0x0f',
            '0x10',
            '0x11',
            '0x12',
        ];
        expect(result.data).to.eql(expectedSigned1);
        // Let's verify the signature explictly
        // (It was already verified underneath in building it, but we check again for demo purposes)
        var verifySigResult = await index.verifyAuthorIdentity(result.data, [address, address]);
        expect(verifySigResult.verified).to.equal(true);
        expect(verifySigResult.addresses).to.eql([
            {
                address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                ],
                pos: 7
            },
            {
                address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18
                ],
                pos: 19
            }
        ]);
    });

    it('should return success buildFile utf-8 and sign it with the different public keys', async () => {
        // buildFile request so we can inspect the resulting OP_RETURN field array
        // We can use it to feed it into create function directly and inspect
        var buildRequest = {
            file: {
                content: 'Hello world!',
                contentType: 'text/plain',
            },
            signatures: [
                {
                    key: privateKey
                },
                {
                    key: privateKey2
                }
            ]
        };
        // Build the actual field
        var result = await index.buildFile(buildRequest);
        // The request was successful
        expect(result.success).to.equal(true);
        // Inspect the response
        // Notice that the AUTHOR SIGNATURE protocol was added after the pipe '|' automatically
        const expectedSigned1 = [
            '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
            '0x48656c6c6f20776f726c6421',
            '0x746578742f706c61696e',
            '0x7574662d38',
            '0x00',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1cacee1dbe375e3e17a662b560944e0ff78dff9f194744fb2ee462d905bc785727420d5deed4b2dd019023f550af4f4f7934050179e217220592a41882f0251ef4',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05',
            '0x06',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31396e6b6e4c68526e474b525233686f6265467575716d48554d694e544b5a487352',
            '0x1b4212864c799a9d2f1ceb7b4e8e14c5cb6d943a380671bbc55dcd699930343cbd1edf62a204589f8a384f894765b4b98b2e1acbd3a9af493007ef85624d2d2c50',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05',
            '0x06',
            '0x07',
            '0x08',
            '0x09',
            '0x0a',
            '0x0b',
            '0x0c',
            '0x0d',
            '0x0e',
            '0x0f',
            '0x10',
            '0x11',
            '0x12'
        ];
        expect(result.data).to.eql(expectedSigned1);
        // Let's verify the signature explictly
        // (It was already verified underneath in building it, but we check again for demo purposes)
        var verifySigResult = await index.verifyAuthorIdentity(result.data, [address, address2]);
        expect(verifySigResult.verified).to.equal(true);
        expect(verifySigResult.addresses).to.eql([
            {
                address: address,
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                ],
                pos: 7
            },
            {
                address: address2,
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18
                ],
                pos: 19
            }
        ]);
    });

    it('should return success buildFile utf-8 and signs it with a public key and then create the file', async () => {
        // buildFile request so we can inspect the resulting OP_RETURN field array
        // We can use it to feed it into create function directly and inspect
        var buildRequest = {
            file: {
                content: '{ "message": "Hello world!" }',
                contentType: 'application/json',
            },
            signatures: [
                {
                    key: privateKey
                }
            ]
        };
        // Build the actual field
        var result = await index.buildFile(buildRequest);
        // The request was successful
        expect(result.success).to.equal(true);
        // Inspect the response
        // Notice that the AUTHOR SIGNATURE protocol was added after the pipe '|' automatically
        const expectedSigned1 = [
            '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
            '0x7b20226d657373616765223a202248656c6c6f20776f726c642122207d',
            '0x6170706c69636174696f6e2f6a736f6e',
            '0x7574662d38',
            '0x00',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1b7f1cd9ab8ea94cd8cc2bc0b598aa41b2420faf6b0593fe851478d1c22a42c6d73b3890e0f2743e0d21c4f7fa0023362bf9f15dc9a16511ab57714dce1ae3f35f',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05',
            '0x06'
        ];
        expect(result.data).to.eql(expectedSigned1);
        // Let's verify the signature explictly
        // (It was already verified underneath in building it, but we check again for demo purposes)
        var verifySigResult = await index.verifyAuthorIdentity(result.data, [address]);
        expect(verifySigResult.verified).to.equal(true);
        expect(verifySigResult.addresses).to.eql([
            {
                address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                ],
                pos: 7,
            }
        ]);

        // Now create the file from the constructed array using the datapay wrapper
        /*
        // Uncomment this section to make a on-chain tx
        var result = await index.datapay({
            data: result.data,
            pay: {
                key: privateKey
            }
        });
        console.log('datapay result', result);
        */
        
        /*
        {
            success: true,
            txid: 'adea8134aa16addb234a9b474228723cb71022f7226895a64011c8a62570749b'
        }
        */
        expect(result.success).to.equal(true);
    });

    it('should return success even if content and contentType is already hex encoded', async () => {
        var buildRequest = {
            file: {
                content: '0x68656C6C6F',
                contentType: '0x746578742F706C61696E',
                tags: [
                    '0x68656C6C6F',
                    'hello'
                ]
            }
        };
        var result = await index.buildFile(buildRequest);
        expect(result.success).to.equal(true);
        expect(result.data).to.eql([
            '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
            '0x68656c6c6f',
            '0x746578742f706c61696e',
            '0x7574662d38',
            '0x00',
            '0x68656c6c6f',
            '0x68656c6c6f'
        ]);
    });

    it('should return success if nothing is hex encoded', async () => {
        var buildRequest = {
            file: {
                content: 'hello world',
                contentType: 'text/markdown',
                name: 'hello.md',
            }
        };
        var result = await index.buildFile(buildRequest);
        expect(result.success).to.equal(true);
        expect(result.data).to.eql([
            '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
            '0x68656c6c6f20776f726c64',
            '0x746578742f6d61726b646f776e',
            '0x7574662d38',
            '0x68656c6c6f2e6d64'
        ]);
    });
});