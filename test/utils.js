'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');
var bsvMessage = require('bsv/message');
bsv.Message = bsvMessage;

const privateKey = '';
const address = '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz';

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
        expect(function() {
            index.signArguments({
                args: ['-'],
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

    it('#buildAuthorIdentity success to create an author identity', async () => {
        const signature = index.signArguments({
            args: [Buffer.from('|'), '0x01', Buffer.from('hello, world'), '0x103A', '0x', '', Buffer.from('|')],
            address: address,
            key: privateKey
        });

        const bufs = Buffer.concat([
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
            '0x' + Buffer.from('1.0.0').toString('hex'),
            '0x' + Buffer.from('ECDSA').toString('hex'),
            '0x' + Buffer.from(address).toString('hex'),
            '0x' + Buffer.from(expectedSignature, 'base64').toString('hex'),
            '0x07', // relative negative index
            '0x07', // number of indexes to follow
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05',
            '0x06'
        ];
        expect(opReturnHexArray).to.eql(expected);
    });

    it('#buildAuthorIdentity success to create an author identity', async () => {
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
            indexes: [0, 1, 5]
        });

     const expected = [
            '0x' + Buffer.from('15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva').toString('hex'),
            '0x' + Buffer.from('1.0.0').toString('hex'),
            '0x' + Buffer.from('ECDSA').toString('hex'),
            '0x' + Buffer.from(address).toString('hex'),
            '0x' + Buffer.from(expectedSignature, 'base64').toString('hex'),
            '0x07', // relative negative index
            '0x03', // number of indexes to follow
            '0x00',
            '0x01',
            '0x05'
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
            '0x312e302e30',
            '0x4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1cea8eb97421f79a3c672acd8be81847c3344559b22e31523ec4b8b57047d561910cac077a71c57f7ec06da6a44a3e3936a530e95f87cdc097ccf40bf6d31c18e7',
            '0x07',
            '0x03',
            '0x00',
            '0x01',
            '0x05'
        ];
        const verified = index.verifyAuthorIdentity(opReturnFields);
        expect(verified).to.eql(true);
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
            '312e302e30',
            '4543445341',
            '31455868536247466945415a4345356565427655785436634256486872705057587a',
            '1cea8eb97421f79a3c672acd8be81847c3344559b22e31523ec4b8b57047d561910cac077a71c57f7ec06da6a44a3e3936a530e95f87cdc097ccf40bf6d31c18e7',
            '07',
            '03',
            '00',
            '01',
            '05'
        ];
        const verified = index.verifyAuthorIdentity(opReturnFields);
        expect(verified).to.eql(true);
    });

    it('#verifyAuthorIdentity fail to sign with inadequate arguments', async () => {
        let verified = index.verifyAuthorIdentity([]);
        expect(verified).to.eql(false);
        expect(function() {
            let verified = index.verifyAuthorIdentity(null);
            expect(verified).to.eql(false);
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
            '0x312e302e30',
            '0x4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1cea8eb97421f79a3c672acd8be81847c3344559b22e31523ec4b8b57047d561910cac077a71c57f7ec06da6a44a3e3936a530e95f87cdc097ccf40bf6d31c18e7',
            '0x07',
            '0x03',
            '0x00',
            '0x01',
        ];
        const verified = index.verifyAuthorIdentity(opReturnFields);
        expect(verified).to.eql(false);
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
        const verified = index.verifyAuthorIdentity(opReturnFields);
        expect(verified).to.eql(false);
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
            '0x312e302e30',
            '0x4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x0cea8eb97421f79a3c672acd8be81847c3344559b22e31523ec4b8b57047d561910cac077a71c57f7ec06da6a44a3e3936a530e95f87cdc097ccf40bf6d31c18e7',
            '0x07',
            '0x03',
            '0x00',
            '0x01',
            '0x05'
        ];
        const verified = index.verifyAuthorIdentity(opReturnFields);
        expect(verified).to.eql(false);
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
            indexes: [1, 2, 3, 5, 6]
        });
        const expected = [
            '0x' + Buffer.from('15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva').toString('hex'),
            '0x' + Buffer.from('1.0.0').toString('hex'),
            '0x' + Buffer.from('ECDSA').toString('hex'),
            '0x' + Buffer.from(address).toString('hex'),
            '0x' + Buffer.from(expectedSignature, 'base64').toString('hex'),
            '0x07', // relative negative index
            '0x05', // number of indexes to follow
            '0x01',
            '0x02',
            '0x03',
            '0x05',
            '0x06'
        ];
        expect(opReturnHexArray).to.eql(expected);
        const opReturnFields = args.concat(expected);
        const verified = index.verifyAuthorIdentity(opReturnFields);
        expect(verified).to.eql(true);
    });

    it('#buildAuthorIdentity and #verifyAuthorIdentity success with a simpler example', async () => {
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
        const verified = index.verifyAuthorIdentity(fullOpReturnFields);
        expect(verified).to.eql(true);
    });

    it('#buildAuthorIdentity and #verifyAuthorIdentity success with a simpler example', async () => {
        // These are the OP_RETURN buffers that you want to sign
        // Step 1. Declare what OP_RETURN fields you want to sign
        const args = [
            Buffer.from('sign me').toString('hex'),
            Buffer.from('and me').toString('hex'),
            Buffer.from('|').toString('hex'),
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
        const verified = index.verifyAuthorIdentity(fullOpReturnFields);
        expect(verified).to.eql(true);
    });

})
