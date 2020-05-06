'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');
var bsvMessage = require('bsv/message');
bsv.Message = bsvMessage;

// Do not use this to send money!
// You will lose your bitcoin!
// This is here for testing purposes only
const privateKey = '5KLpZB2Sfn4S7QXh6rRynXrVZXXT8zTdQBaj7Ngs3ZHpip5zd8r';
const address = '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz';
const privateKey2 = '5Hy9zVymDHhavj55sRdQ5nWTYYeJ2BsJdFDpfPutcc7RZUJg59H';
const address2 = '19nknLhRnGKRR3hobeFuuqmHUMiNTKZHsR';

describe('sign', () => {
    it('#signArguments should fail insufficient args add Author Identity Signature', async () => {
        expect(function() {
            index.signArguments({
                args: [],
                address: '',
                key: '',
                indexes: []
            });
        }).to.throw(Error);
    });

    it('#signArguments should fail insufficient indexes add Author Identity Signature', async () => {
        expect(function() {
            index.signArguments({
                args: ['00'],
                address: '',
                key: '',
                indexes: []
            });
        }).to.throw(Error);
    });

    it('#signArguments should fail negative indexes add Author Identity Signature', async () => {
        expect(function() {
            index.signArguments({
                args: ['00', '01'],
                address: '',
                key: '',
                indexes: [-1]
            });
        }).to.throw(Error);
    });

    it('#signArguments should fail invalid address add Author Identity Signature', async () => {
        expect(function() {
            index.signArguments({
                args: ['00', '01'],
                address: '',
                key: '',
                indexes: [0]
            });
        }).to.throw(Error); // Input string too short
    });

    it('#signArguments should fail non-hex Author Identity Signature', async () => {
        expect(function() {
            index.signArguments({
                args: ['00', '01'],
                address: address,
                key: '',
                indexes: [0]
            });
        }).to.throw(Error); // Input string too short
    });

    it('#signArguments should fail invalid key add Author Identity Signature', async () => {
        expect(function() {
            index.signArguments({
                args: ['000', '01'],
                address: address,
                key: '',
                indexes: [0]
            });
        }).to.throw(Error); // Input string too short

        expect(function() {
            index.signArguments({
                args: ['', '01'],
                address: address,
                key: '',
                indexes: [0]
            });
        }).to.throw(Error); // Input string too short
    });

    it('#signArguments should Author Identity Signature success', async () => {
        const result = index.signArguments({
            args: ['00', '01'],
            address: address,
            key: privateKey,
            indexes: [0, 1]
        });
        const expectedSignature = bsv.Message(Buffer.from('0001', 'hex')).sign(bsv.PrivateKey(privateKey))
        expect(expectedSignature).to.eql('G9ndxGjS4dairVPxoN8wA0086XqUjG5qy2Wp3JnfDHHGQgy1UobjLmkpwTE/j6k5F5xQ95FyZgH/kigTdyt5Ya4=');
        expect(result).to.eql('G9ndxGjS4dairVPxoN8wA0086XqUjG5qy2Wp3JnfDHHGQgy1UobjLmkpwTE/j6k5F5xQ95FyZgH/kigTdyt5Ya4=');
    });

    it('#signArguments should throw error invalid types', async () => {
        expect(function() {
            index.signArguments({
                args: [undefined],
                address: address,
                key: privateKey,
                indexes: [0]
            });
        }).to.throw(Error);
    });

    it('#signArguments should encode empty buffer', async () => {
        const result = index.signArguments({
            args: [Buffer.from([])],
            address: address,
            key: privateKey,
            indexes: [0]
        });
        const expectedSignature = bsv.Message(Buffer.from('00', 'hex')).sign(bsv.PrivateKey(privateKey))
        expect(result).to.eql(expectedSignature);
    });

    it('#signArguments should encode 0x00 ', async () => {
        const result = index.signArguments({
            args: ['0x00'],
            address: address,
            key: privateKey,
            indexes: [0]
        });
        const expectedSignature = bsv.Message(Buffer.from('00', 'hex')).sign(bsv.PrivateKey(privateKey))
        expect(result).to.eql(expectedSignature);
        expect(result).to.eql('Gx14Nddv7wN6BEuLU/miLTZHqxrvO9dF/BYtFzaKu/HwNNLQ3OoPEPx86typr2fzJqrh8Vdfzo0KG6lusB/3tvA=');
    });

    it('#signArguments should encode 0x01', async () => {
        const result = index.signArguments({
            args: ['0x01'],
            address: address,
            key: privateKey,
            indexes: [0]
        });
        const expectedSignature = bsv.Message(Buffer.from('01', 'hex')).sign(bsv.PrivateKey(privateKey))
        expect(result).to.eql(expectedSignature);
    });

    it('#signArguments should encode 0xabde', async () => {
        const result = index.signArguments({
            args: ['0xabde'],
            address: address,
            key: privateKey,
            indexes: [0]
        });
        const expectedSignature = bsv.Message(Buffer.from('ABDE', 'hex')).sign(bsv.PrivateKey(privateKey))
        expect(result).to.eql(expectedSignature);
    });

    it('#signArguments should encode abde', async () => {
        const result = index.signArguments({
            args: ['abde'],
            address: address,
            key: privateKey,
            indexes: [0]
        });
        const expectedSignature = bsv.Message(Buffer.from('abdE', 'hex')).sign(bsv.PrivateKey(privateKey))
        expect(result).to.eql(expectedSignature);
    });

    it('#signArguments should encode 00', async () => {
        const result = index.signArguments({
            args: ['00'],
            address: address,
            key: privateKey,
            indexes: [0]
        });
        const expectedSignature = bsv.Message(Buffer.from('00', 'hex')).sign(bsv.PrivateKey(privateKey))
        expect(result).to.eql(expectedSignature);
        expect(result).to.eql('Gx14Nddv7wN6BEuLU/miLTZHqxrvO9dF/BYtFzaKu/HwNNLQ3OoPEPx86typr2fzJqrh8Vdfzo0KG6lusB/3tvA=');
    });

    it('#signArguments should encode mixed hex string and buffers', async () => {
        const result = index.signArguments({
            args: ['00', '0x01', Buffer.from('hello, world'), '0x103A', '0x', ''],
            address: address,
            key: privateKey,
            indexes: [0,1,2,3,4,5]
        });

        const bufs = Buffer.concat([
            Buffer.from('00', 'hex'),
            Buffer.from('01', 'hex'),
            Buffer.from('hello, world'),
            Buffer.from('103a', 'hex'),
            Buffer.from('00', 'hex'),   // Padded at end
            Buffer.from('00', 'hex'),   // Padded at end
        ]);
        const expectedSignature = bsv.Message(bufs).sign(bsv.PrivateKey(privateKey))
        expect(result).to.eql(expectedSignature);
    });

    it('#signArguments should encode mixed hex string and buffers', async () => {
        const result = index.signArguments({
            args: ['00', '0x01', Buffer.from('hello, world'), '0x103A', '0x42', ''],
            address: address,
            key: privateKey,
            indexes: [0,2,3,4]
        });

        const bufs = Buffer.concat([
            Buffer.from('00', 'hex'),
            Buffer.from('hello, world'),
            Buffer.from('103a', 'hex'),
            Buffer.from('42', 'hex'),   // Padded at end
        ]);
        const expectedSignature = bsv.Message(bufs).sign(bsv.PrivateKey(privateKey))
        expect(result).to.eql(expectedSignature);
    });

    it('#signArguments assume all is to be signed', async () => {
        const result = index.signArguments({
            args: ['00', '0x01', Buffer.from('hello, world'), '0x103A', '0x', ''],
            address: address,
            key: privateKey
        });

        const bufs = Buffer.concat([
            Buffer.from('00', 'hex'),
            Buffer.from('01', 'hex'),
            Buffer.from('hello, world'),
            Buffer.from('103a', 'hex'),
            Buffer.from('00', 'hex'),   // Padded at end
            Buffer.from('00', 'hex'),   // Padded at end
        ]);
        const expectedSignature = bsv.Message(bufs).sign(bsv.PrivateKey(privateKey))
        expect(result).to.eql(expectedSignature);
    });

    it('#buildAuthorIdentity success to create an author identity 1', async () => {
        const signature = index.signArguments({
            args: ['0x6a', Buffer.from('|'), '0x01', Buffer.from('hello, world'), '0x103A', '0x', '', Buffer.from('|')],
            address: address,
            key: privateKey
        });

        const bufs = Buffer.concat([
            Buffer.from('6a', 'hex'),
            Buffer.from('|'),
            Buffer.from('01', 'hex'),
            Buffer.from('hello, world'),
            Buffer.from('103a', 'hex'),
            Buffer.from('00', 'hex'),
            Buffer.from('00', 'hex'),
            Buffer.from('|'),
        ]);
        const expectedSignature = bsv.Message(bufs).sign(bsv.PrivateKey(privateKey))
        expect(signature).to.eql(expectedSignature);

        const opReturnHexArray = index.buildAuthorIdentity({
            args: [
                Buffer.from('|'),
                '0x01',
                Buffer.from('hello, world'),
                '0x103A',
                '0x',
                '',
                Buffer.from('|')
            ],
            address: address,
            key: privateKey
        });

        const expected = [
            '0x' + Buffer.from('15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva').toString('hex'),
            '0x' + Buffer.from('BITCOIN_ECDSA').toString('hex'),
            '0x' + Buffer.from(address).toString('hex'),
            '0x' + Buffer.from(expectedSignature, 'base64').toString('hex')
        ];
        expect(opReturnHexArray).to.eql(expected);
    });

    it('#buildAuthorIdentity success to create an author identity 2', async () => {
        const signature = index.signArguments({
            args: [Buffer.from('|'), '0x01', Buffer.from('hello, world'), '0x103A', '0x', '', Buffer.from('|')],
            address: address,
            key: privateKey,
            indexes: [0, 1, 5]
        });

        const bufs = Buffer.concat([
            Buffer.from('|'),
            Buffer.from('01', 'hex'),
            Buffer.from('00', 'hex')
        ]);
        const expectedSignature = bsv.Message(bufs).sign(bsv.PrivateKey(privateKey))
        expect(signature).to.eql(expectedSignature);

        const opReturnHexArray = index.buildAuthorIdentity({
            args: [
                Buffer.from('|'),
                '0x01',
                Buffer.from('hello, world'),
                '0x103A',
                '0x',
                '',
                Buffer.from('|')
            ],
            address: address,
            key: privateKey,
            indexes: [1, 2, 6]
        });

     const expected = [
            '0x' + Buffer.from('15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva').toString('hex'),
            '0x' + Buffer.from('BITCOIN_ECDSA').toString('hex'),
            '0x' + Buffer.from(address).toString('hex'),
            '0x' + Buffer.from(expectedSignature, 'base64').toString('hex'),
            '0x01',
            '0x02',
            '0x06'
        ];
        expect(opReturnHexArray).to.eql(expected);
    });

    it('#verifyAuthorIdentity success to create an author identity', async () => {
        const opReturnFields = [
            Buffer.from('|').toString('hex'),
            '0x01',
            Buffer.from('hello, world').toString('hex'),
            '0x103A',
            '0x00',
            '00',
            Buffer.from('|').toString('hex'),
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            Buffer.from('BITCOIN_ECDSA').toString('hex'),
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1cea8eb97421f79a3c672acd8be81847c3344559b22e31523ec4b8b57047d561910cac077a71c57f7ec06da6a44a3e3936a530e95f87cdc097ccf40bf6d31c18e7',
            '0x01',
            '0x02',
            '0x06'
        ];
        const verified = index.verifyAuthorIdentity(opReturnFields, ['1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz']);
        expect(verified.verified).to.eql(true);
    });

    it('#verifyAuthorIdentity success to create an author identity', async () => {
        const opReturnFields = [
            Buffer.from('|').toString('hex'),
            '01',
            Buffer.from('hello, world').toString('hex'),
            '103A',
            '0x00',
            '00',
            Buffer.from('|').toString('hex'),
            '313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            Buffer.from('BITCOIN_ECDSA').toString('hex'),
            '31455868536247466945415a4345356565427655785436634256486872705057587a',
            '1cea8eb97421f79a3c672acd8be81847c3344559b22e31523ec4b8b57047d561910cac077a71c57f7ec06da6a44a3e3936a530e95f87cdc097ccf40bf6d31c18e7',
            '01',
            '02',
            '06'
        ];
        const verified = index.verifyAuthorIdentity(opReturnFields, ['1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz']);
        expect(verified.verified).to.eql(true);
    });

    it('#verifyAuthorIdentity fail to sign with inadequate arguments', async () => {
        expect(function() {
            let verified = index.verifyAuthorIdentity([]);
            expect(verified.verified).to.eql(false);
        }).to.throw(Error);

        expect(function() {
            let verified = index.verifyAuthorIdentity(null);
            expect(verified.verified).to.eql(false);
        }).to.throw(Error);
    });

    it('#verifyAuthorIdentity fail with inadequate args 1', async () => {
        const opReturnFields = [
            Buffer.from('|').toString('hex'),
            '0x01',
            Buffer.from('hello, world').toString('hex'),
            '0x103A',
            '0x00',
            '00',
            Buffer.from('|').toString('hex'),
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            Buffer.from('BITCOIN_ECDSA').toString('hex'),
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1cea8eb97421f79a3c672acd8be81847c3344559b22e31523ec4b8b57047d561910cac077a71c57f7ec06da6a44a3e3936a530e95f87cdc097ccf40bf6d31c18e7',
            '0x07',
            '0x03',
            '0x00',
            '0x01',
        ];
        const verified = index.verifyAuthorIdentity(opReturnFields, ['1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz']);
        expect(verified.verified).to.eql(false);
    });

    it('#verifyAuthorIdentity fail with inadequate args 2', async () => {
        const opReturnFields = [
            Buffer.from('|').toString('hex'),
            '0x01',
            Buffer.from('hello, world').toString('hex'),
            '0x103A',
            '0x00',
            '00',
            Buffer.from('|').toString('hex'),
            '0x312e302e30',
            '0x4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1cea8eb97421f79a3c672acd8be81847c3344559b22e31523ec4b8b57047d561910cac077a71c57f7ec06da6a44a3e3936a530e95f87cdc097ccf40bf6d31c18e7',
            '0x07',
            '0x03',
            '0x00',
            '0x01',
        ];
        const verified = index.verifyAuthorIdentity(opReturnFields, '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz');
        expect(verified.verified).to.eql(false);
    });

    it('#verifyAuthorIdentity fail with invalid', async () => {
        const opReturnFields = [
            Buffer.from('|').toString('hex'),
            '0x01',
            Buffer.from('hello, world').toString('hex'),
            '0x103A',
            '0x00',
            '00',
            Buffer.from('|').toString('hex'),
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            Buffer.from('BITCOIN_ECDSA').toString('hex'),
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x0cea8eb97421f79a3c672acd8be81847c3344559b22e31523ec4b8b57047d561910cac077a71c57f7ec06da6a44a3e3936a530e95f87cdc097ccf40bf6d31c18e7',
            '0x07',
            '0x03',
            '0x00',
            '0x01',
            '0x05'
        ];
        expect(function() {
            index.verifyAuthorIdentity(opReturnFields, '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz');
        }).to.throw(Error);
    });

    it('#signArguments with indexes', async () => {
        const args = [
            Buffer.from('dont sign here either'),
            Buffer.from('532156', 'hex'),
            Buffer.from('99129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912', 'hex'),
            Buffer.from('hello, world'),
            Buffer.from('dont sign this'),
            Buffer.from('|'),
            Buffer.from('sign this tho')
        ];
        const signature = index.signArguments({
            args: args,
            address: address,
            key: privateKey,
            indexes: [1, 2, 3, 5, 6]
        });
        const bufs = Buffer.concat([
            Buffer.from('532156', 'hex'),
            Buffer.from('99129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912', 'hex'),
            Buffer.from('hello, world'),
            Buffer.from('|'),
            Buffer.from('sign this tho')
        ]);
        const expectedSignature = bsv.Message(bufs).sign(bsv.PrivateKey(privateKey))
        expect(signature).to.eql(expectedSignature);
    });

    it('#buildAuthorIdentity and #verifyAuthorIdentity success to create an author identity', async () => {
        const args = [
            Buffer.from('dont sign here either'),
            Buffer.from('532156', 'hex'),
            Buffer.from('99129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912', 'hex'),
            Buffer.from('hello, world'),
            Buffer.from('dont sign this'),
            Buffer.from('|'),
            Buffer.from('sign this tho')
        ];
        const signature = index.signArguments({
            args: args,
            address: address,
            key: privateKey,
            indexes: [1, 2, 3, 5, 6]
        });
        const bufs = Buffer.concat([
            Buffer.from('532156', 'hex'),
            Buffer.from('99129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912991299129912', 'hex'),
            Buffer.from('hello, world'),
            Buffer.from('|'),
            Buffer.from('sign this tho')
        ]);
        const expectedSignature = bsv.Message(bufs).sign(bsv.PrivateKey(privateKey))
        expect(signature).to.eql(expectedSignature);
        const opReturnHexArray = index.buildAuthorIdentity({
            args: args,
            address: address,
            key: privateKey,
            indexes: [2, 3, 4, 6, 7]
        });
        const expected = [
            '0x' + Buffer.from('15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva').toString('hex'),
            '0x' + Buffer.from('BITCOIN_ECDSA').toString('hex'),
            '0x' + Buffer.from(address).toString('hex'),
            '0x' + Buffer.from(expectedSignature, 'base64').toString('hex'),
            '0x02',
            '0x03',
            '0x04',
            '0x06',
            '0x07'
        ];
        expect(opReturnHexArray).to.eql(expected);
        const opReturnFields = args.concat(expected);
        const verified = index.verifyAuthorIdentity(opReturnFields, [address]);
        expect(verified).to.eql({
            "addresses": [
                {
                    "address": "1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
                    "fieldIndexesForSignature": [
                        2,
                        3,
                        4,
                        6,
                        7,
                    ],
                    "pos": 8,
                    "verified": true,
                }
            ],
            "signedFullyByAddresses": [], // Notice that this is empty. Because the address does not fully sign to the left
             "verified": true,
        });
    });

    it('#buildAuthorIdentity and #verifyAuthorIdentity success example 1', async () => {
        // These are the OP_RETURN buffers that you want to sign
        // Step 1. Declare what OP_RETURN fields you want to sign
        const args = [
            Buffer.from('sign me'),
            Buffer.from('and me'),
            Buffer.from('|')
        ];

        // Optional, you can generate the signature if you like and inspect it
        /* const signature = index.signArguments({
            args: args,
            address: address,
            key: privateKey
        });
        */

        // Build the OP_RETURN payload for AUTHOR_IDENTITY, assume all args are used
        // Step 2. Build the AUTHOR_IDENTITY from the args, address and key
        const opReturnHexArray = index.buildAuthorIdentity({
            args: args,
            address: address,
            key: privateKey
        });
        const fullOpReturnFields = args.concat(opReturnHexArray);
        const verified = index.verifyAuthorIdentity(fullOpReturnFields, [address]);
        expect(verified.verified).to.eql(true);
    });

    it('#buildAuthorIdentity and #verifyAuthorIdentity success example 2', async () => {
        // These are the OP_RETURN buffers that you want to sign
        // Step 1. Declare what OP_RETURN fields you want to sign
        const args = [
            Buffer.from('sign me').toString('hex'),
            Buffer.from('and me').toString('hex'),
            Buffer.from('|').toString('hex'),
        ];

        // Build the OP_RETURN payload for AUTHOR_IDENTITY, assume all args are used
        // Step 2. Build the AUTHOR_IDENTITY from the args, address and key
        const opReturnHexArray = index.buildAuthorIdentity({
            args: args,
            address: address,
            key: privateKey
        }, false);
        const fullOpReturnFields = args.concat(opReturnHexArray);
        expect(fullOpReturnFields).to.eql([
            '7369676e206d65',
            '616e64206d65',
            '7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1b9c4e98846f8882c3146be1ccc4daa59a74fec5d4897e5c913f60d99db63f639b7ff17dac3954af7ddf8e8dc433cc9848a644c125deb70dd35899146762d486ff'
        ]);
        const verified = index.verifyAuthorIdentity(fullOpReturnFields, [address]);
        expect(verified).to.eql({
            verified: true,
            signedFullyByAddresses: [
                address,
            ],
            addresses: [
                {
                    "address": address,
                    "fieldIndexesForSignature": [
                        0,
                        1,
                        2,
                        3
                    ],
                    "pos": 4,
                    "verified": true,
                }
            ]
        });
    });


    it('should detect addresses from the payload', async () => {
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
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31396e6b6e4c68526e474b525233686f6265467575716d48554d694e544b5a487352',
            '0x1c101c7d3cb207a6718e773856349b47e6676bf8b1be2c3096841b2181d736ab156645e0a84318dc0691574a26ed9a7c9b8abe7e0c30af845680259f59ceec319d',
        ];
        expect(result.data).to.eql(expectedSigned1);
        // Let's verify the signature explictly
        // (It was already verified underneath in building it, but we check again for demo purposes)
        var detectAddressesResult = await index.detectAndVerifyAuthorIdentities(result.data);
        expect(detectAddressesResult).to.eql({
            verified: true,
            signedFullyByAddresses: [
                address,
                address2
            ],
            addresses: [
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
                        6
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
                    ],
                    pos: 12
                }
            ]
        });
    });

    it('should detect addresses from the payload 2', async () => {

        const privateKey = '5KLpZB2Sfn4S7QXh6rRynXrVZXXT8zTdQBaj7Ngs3ZHpip5zd8r';
        const address = '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz';
        let key = 'zebra.jpg';
        let value = '0f9e7b6542eba739bd407323f58d75327dd1d68a53d2a535337a4dcf0ddb0edc';
        let type = 'b';
        let data = ['19iG3WTYSsbyos3uJ733yK4zEioi1FesNU', key, value, type, 1556769439019];

        data = data.concat(
            '|',
            index.buildAuthorIdentity({
                args: data.map((val) => Buffer.from('' + val)),
                address: address,
                key: privateKey,
            })
        );

        const expectedSigned1 = [
            '0x3139694733575459537362796f7333754a373333794b347a45696f69314665734e55',
            '0x7a656272612e6a7067',
            '0x30663965376236353432656261373339626434303733323366353864373533323764643164363861353364326135333533333761346463663064646230656463',
            '0x62',
            // '' + 1556769439019, // '0x31353536373639343339303139',
            '0x31353536373639343339303139',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1cfaa2939650c7f453a4bd9dbfa7cab719987e69d8fc86cab5c75bacf1967a41cb4108b75af8281e9aaeef4c95e01ba64c7436f8941c99fb40437d79680fc722a7',
        ];
        // Let's verify the signature explictly
        // (It was already verified underneath in building it, but we check again for demo purposes)
        var detectAddressesResult = await index.detectAndVerifyAuthorIdentities(expectedSigned1);
        expect(detectAddressesResult).to.eql({ verified: true,
            addresses:
             [ { address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
                 verified: true,
                 pos: 6,
                 fieldIndexesForSignature: [0, 1, 2, 3, 4, 5] } ],
            signedFullyByAddresses: [ '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz' ] });
    });

    
})



