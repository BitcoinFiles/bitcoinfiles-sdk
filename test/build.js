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
            pay: {
                key: privateKey
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
            '0x1c97ffc1a7231bd671df54bd1fa171bd764f22905adc3465753665b5f28e36b1f30a82503984d32175e6aca75fbc53a7f81b4bcd20c074984f5f071eb529fad2a3',
            '0x06',
            '0x06',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05'
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
                ],
                pos: 6
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
            pay: {
                key: privateKey
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
            '0x1cb176af0881babbfb5b7b184a3090062e56e9554bac8eb23ab82f97920aa7153c7406437857a3584aab91fcbb5b180e59812ba318d1f6990f725265cb1c32160a',
            '0x06',
            '0x06',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05'
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
                ],
                pos: 6
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
            pay: {
                key: privateKey
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
            '0x1c97ffc1a7231bd671df54bd1fa171bd764f22905adc3465753665b5f28e36b1f30a82503984d32175e6aca75fbc53a7f81b4bcd20c074984f5f071eb529fad2a3',
            '0x06',
            '0x06',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1cbb87434c1e13eca9b16d1908b4a9720051d53223bbdbd223b6b103ef2abcf4215f3420648715d5e132971dd5df7f87338f39429c7b92618c0641af8beccffd60',
            '0x13',
            '0x13',
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
                ],
                pos: 6
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
            pay: {
                key: privateKey
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
            '0x1c97ffc1a7231bd671df54bd1fa171bd764f22905adc3465753665b5f28e36b1f30a82503984d32175e6aca75fbc53a7f81b4bcd20c074984f5f071eb529fad2a3',
            '0x06',
            '0x06',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31396e6b6e4c68526e474b525233686f6265467575716d48554d694e544b5a487352',
            '0x1b88faf24d32af9d50e200351bc808d6b01f3653b15a1f99cf9652704f95e7653a463ec95771b888e9878cc6425eafe4ef0e42c3b9f0b9572da6ab5af28a701974',
            '0x13',
            '0x13',
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
                ],
                pos: 6
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
            pay: {
                key: privateKey
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
            '0x7b20226d657373616765223a202248656c6c6f20776f726c6421227d',
            '0x6170706c69636174696f6e2f6a736f6e',
            '0x7574662d38',
            '0x00',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1b3ffcb62a3bce00c9b4d2d66196d123803e31fa88d0a276c125f3d2524858f4d16bf05479fb1f988b852fe407f39e680a1d6d954afa0051cc34b9d444ee6cb0af',
            '0x06',
            '0x06',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05'
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
                ],
                pos: 6
            }
        ]);

        // Now create the file from the constructed array using the datapay wrapper
        var result = await index.datapay({
            data: result.data,
            pay: {
                key: privateKey
            }
        });
        console.log('datapay result', result);
        /*
        {
            success: true,
            txid: 'adea8134aa16addb234a9b474228723cb71022f7226895a64011c8a62570749b'
        }
        */
        expect(result.success).to.equal(true);
    });
});