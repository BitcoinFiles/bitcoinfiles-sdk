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
            '0x312e302e30',
            '0x4543445341',
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
        expect(function() {
            index.verifyAuthorIdentity(opReturnFields, '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz');
        }).to.throw(Error);
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
        const verified = index.verifyAuthorIdentity(opReturnFields, [address]);
        expect(verified.verified).to.eql(true);
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
        expect(fullOpReturnFields[3]).to.eql('313550636948473232534e4c514a584d6f5355615756693757537163376843667661')
        expect(fullOpReturnFields[4]).to.eql('312e302e30')
        expect(fullOpReturnFields[5]).to.eql('4543445341')
        expect(fullOpReturnFields[8]).to.eql('03')
        expect(fullOpReturnFields[9]).to.eql('03')
        expect(fullOpReturnFields[10]).to.eql('00')
        expect(fullOpReturnFields[11]).to.eql('01')
        expect(fullOpReturnFields[12]).to.eql('02')
        const verified = index.verifyAuthorIdentity(fullOpReturnFields, [address]);
        expect(verified.verified).to.eql(true);
    });

    it('#verifyAuthorIdentity success with OP_RETURN string', async () => {

        const opReturnStr = "31394878696756345179427633744870515663554551797131707a5a56646f417574 7b226e616d65223a226d796e616d65222c2262696f223a223c703e62696f3c2f703e5c6e222c226c6f676f223a22227d 6170706c69636174696f6e2f6a736f6e 7574662d38 6d61747465722d70726f66696c652d7570646174652e6a736f6e 7c 314d414565707a67576569367a4b6d627364515379387741594c35795344697a4b6f 6d61747465722d7570646174652d70726f66696c65 623a2f2f37393566363662383238383038396465363365636463356661313239323330663837613732663130656336633764333137383330366439613861366365666161236d61747465722d736368656d612d70726f66696c652d64726166742d303123 7c 313550636948473232534e4c514a584d6f5355615756693757537163376843667661 312e302e30 4543445341 31455868536247466945415a4345356565427655785436634256486872705057587a 1c4bc53c3bf17190e496f7bd14bcfafd0ba9d8f688e601a35be4d078919caff5506cec47598e7c8064941b7ce72fdf61ba949ab5b90f271a0109945fd3f10b102e 0a 0a 00 01 02 03 04 05 06 07 08 09";
        const opReturnArr = opReturnStr.split(' ');
        const verified = index.verifyAuthorIdentity(opReturnArr, [address]);

        expect(verified.verified).to.eql(true);
        expect(verified.addresses).to.eql([{address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz', verified: true}]);
    });

    it('#verifyAuthorIdentity success with OP_RETURN string comparison', async () => {

        const opReturnStr = "31394878696756345179427633744870515663554551797131707a5a56646f417574 7b226e616d65223a2261222c2262696f223a223c703e623c2f703e5c6e222c226c6f676f223a22227d 6170706c69636174696f6e2f6a736f6e 7574662d38 6d61747465722e70726f66696c652e6a736f6e 7c 314d414565707a67576569367a4b6d627364515379387741594c35795344697a4b6f 312e302e30 7c 3150755161374b36324d694b43747373534c4b79316b683536575755374d74555235 534554 656e74697479 6d61747465722e70726f66696c65 76 01 74696d657374616d70 31353532373634353938 7c 313550636948473232534e4c514a584d6f5355615756693757537163376843667661 312e302e30 4543445341 31455868536247466945415a4345356565427655785436634256486872705057587a 1b517b5249b38572f18c9816f776f2006cd2bec6697f5c13f251047227f8cc7f243d0ef47fa76f294dcf5aac9853c1695a0d1531934786d98f112e59f9b99301fc 12 12 00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f 10 11";
        const opReturnArr = opReturnStr.split(' ');
        const verified = index.verifyAuthorIdentity(opReturnArr, [address]);

        expect(verified.verified).to.eql(true);
        expect(verified.addresses).to.eql([{address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz', verified: true}]);

        const opReturnArrayTest = [
            "31394878696756345179427633744870515663554551797131707a5a56646f417574",
            "7b226e616d65223a2261222c2262696f223a223c703e623c2f703e5c6e222c226c6f676f223a22227d",
            "6170706c69636174696f6e2f6a736f6e", "7574662d38", "6d61747465722e70726f66696c652e6a736f6e", "7c",
            "314d414565707a67576569367a4b6d627364515379387741594c35795344697a4b6f", "312e302e30", "7c",
             "3150755161374b36324d694b43747373534c4b79316b683536575755374d74555235", "534554", "656e74697479",
             "6d61747465722e70726f66696c65", "76", "01", "74696d657374616d70", "31353532373634353938", "7c",
             "313550636948473232534e4c514a584d6f5355615756693757537163376843667661", "312e302e30",
             "4543445341", "31455868536247466945415a4345356565427655785436634256486872705057587a",
             "1b517b5249b38572f18c9816f776f2006cd2bec6697f5c13f251047227f8cc7f243d0ef47fa76f294dcf5aac9853c1695a0d1531934786d98f112e59f9b99301fc",
             "12", "12", "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11"];

        expect(opReturnArr).to.eql(opReturnArrayTest);
        const verified2 = index.verifyAuthorIdentity(opReturnArrayTest, [address]);
        expect(verified2.verified).to.eql(true);
        expect(verified2.addresses).to.eql([{address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz', verified: true}]);
    });

    it('#verifyAuthorIdentity success with OP_RETURN string comparison', async () => {

        const opReturnArr = [
            "0x31394878696756345179427633744870515663554551797131707a5a56646f417574",
            "0x7b226e616d65223a226173646661736466222c2262696f223a22222c226c6f676f223a22227d",
            "0x6170706c69636174696f6e2f6a736f6e",
            "0x7574662d38", "0x6d61747465722e70726f66696c652e6a736f6e",
            "0x7c", "0x314d414565707a67576569367a4b6d627364515379387741594c35795344697a4b6f",
            "0x312e302e30", "0x7c", "0x3150755161374b36324d694b43747373534c4b79316b683536575755374d74555235",
            "0x534554", "0x656e74697479", "0x6d61747465722e70726f66696c65", "0x76", "0x01", "0x74696d657374616d70", "0x3563386537613634", "0x7c", "0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661", "0x312e302e30", "0x4543445341", "0x31455868536247466945415a4345356565427655785436634256486872705057587a", "0x1b1f7f61e8f46bc8aacd9ba624fad8b1c7eaaa9fc836533e04096d4ec17f39f1976fdb557bd9d23a676aab7c4bc5d72d8c57be374a512b6cc9f84d12fe80524365", "0x12", "0x12", "0x00", "0x01", "0x02", "0x03", "0x04", "0x05", "0x06", "0x07", "0x08", "0x09", "0x0a", "0x0b", "0x0c", "0x0d", "0x0e", "0x0f", "0x10", "0x11"];
        const verified = index.verifyAuthorIdentity(opReturnArr, [address]);

        expect(verified.verified).to.eql(true);
        expect(verified.addresses).to.eql([{address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz', verified: true}]);

    });
})
