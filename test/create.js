'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

const privateKey = 'your key';

describe('create function test', () => {
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

    /*
    it('should return success created file utf-8 default', async () => {
        var createRequest = {
            file: {
                content: 'hello',
                contentType: 'text/plain',
            },
            pay: {
                key: privateKey
            }
        };

        var result = await index.createFile(createRequest);
        console.log('result', result);
        expect(result.success).to.equal(true);
    });
*/


    it('should return success created file utf-8 default', async () => {
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
        console.log('result', result);
        expect(result.success).to.equal(true);
    });


});