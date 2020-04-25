'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var EventSource = require('eventsource');
var bsv = require('bsv');
var fs = require('fs');
const options = {
    // api_base: 'http://localhost:8082',
    // media_base: 'http://localhost:8082',
    // stream_base: 'http://localhost:8083',
}

describe('sse', () => {

   /* it('listen to events', async () => {
         var es = new EventSource(url + '/filter/747765746368');

        es.onmessage = function (event) {
            console.log(event);
        };

        var es2 = new EventSource(blocks);

        es2.onmessage = function (event) {
            console.log(event);
        };
    });
*/
    /*
    it('listen to all mempool events', async () => {
        var es = new EventSource(url + '/filter');

        es.onmessage = function (event) {
            console.log(event);
        };

        var es2 = new EventSource(blocks);

        es2.onmessage = function (event) {
            console.log(event);
        };
    });
    */
   /* it('listen to 1000000 addresses', async () => {
    var bf = index.instance(options);
    console.log('reading file');
    fs.readFile('./sseaddresses.json', async (err, fileData) => {
        if (err) {
          console.log('read file error', err);
          return reject(null);
        }
        try {
            const addressToAdd = JSON.parse(fileData)
            const saveResult = await bf.saveOutputFilter({
                add: addressToAdd
            });
            console.log('saveresult', saveResult);
            expect(saveResult).to.eql({
                "result": {
                    "id": "1b1d66b75bd3316e9a5e16e30366e453699f8671fbda4b3e39c0b19e75c7886a"
                },
                "success": true,
            });
            console.log('connecting....');
            var es = new EventSource(options.stream_base + `/mempool/filter?outputFilterId=1b1d66b75bd3316e9a5e16e30366e453699f8671fbda4b3e39c0b19e75c7886a`);

            es.onmessage = function (event) {
                console.log(event);
            };

            var es2 = new EventSource(options.stream_base + '/blockheaders');

            es2.onmessage = function (event) {
                console.log(event);
            };
        } catch(err) {
          console.log('read file error serialize', err);

        }
      })
    });*/
    /*

    it('listen to 1000000 addresses', async () => {
        var bf = index.instance(options);

        const hdKey = bsv.HDPrivateKey.fromString('xprv9s21ZrQH143K2n3eo2NqWU8KHGfBkccUgdF1V2djRCmc6dYnwF54534RFgehW4ryy5AXEx6gS1yf4Y3ie464ZQogu7rSotdXBNFNUitZW5T');
        const addressToAdd = [];

        const pubKey = new bsv.HDPublicKey(hdKey);

        for (let i = 0; i < 1000000; i++) {
            const path = `0/${i}`;
            const childPubKey = pubKey.deriveChild(`m/${path}`);
            const bsvAddress = new bsv.Address(childPubKey.publicKey);
            addressToAdd.push(bsvAddress.toString());

            if (i % 1000 === 0) {
                console.log('generating...', i);
            }
        }

        fs.writeFile('./ssseaddresses.json', JSON.stringify(addressToAdd), 'utf8', function(err) {
           console.log('done');
        });
        console.log('done2');

        console.log('finished creating address..');

        if (addressToAdd.length) {
            const saveResult = await bf.saveOutputFilter({
                add: addressToAdd
            });
            console.log('saveresult', saveResult);
            expect(saveResult).to.eql({
                "result": {
                    "id": "6fce8b16ae898ca5d403e3624813f41aee1f0a1bbf1a3c387c49a4af34699ad1"
                },
                "success": true,
            });
        }
        console.log('connecting....');
        var es = new EventSource(options.stream_base + `/mempool/filter?outputFilterId=6fce8b16ae898ca5d403e3624813f41aee1f0a1bbf1a3c387c49a4af34699ad1`);

        es.onmessage = function (event) {
            console.log(event);
        };

        var es2 = new EventSource(options.stream_base + '/blockheaders');

        es2.onmessage = function (event) {
            console.log(event);
        };
    });*/
    /*
    it('listen to outputFilter events', async () => {
        var bf = index.instance(options);

        try {
            const saveResult = await bf.saveOutputFilter({
                add: [
                    '1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf',
                ]
            });

            expect(saveResult).to.eql({
                "result": {
                    "id": "76bd9cc14cb428b458ecb7d69a06f6b5599079fb7134112fd059d638921ae8e6"
                },
                "success": true,
            });
            var es = new EventSource(url + `/filter?outputFilterId=${saveResult.result.id}`);

            es.onmessage = function (event) {
                console.log(event);
            };

            var es2 = new EventSource(blocks);

            es2.onmessage = function (event) {
                console.log(event);
            };

        } catch (err) {
            console.log(err);
            expect(true).to.eql(false);
        }
    });*/
/*
    it('listen to outputFilter events', async () => {
        var es = new EventSource(url + '/filter?outputFilter=1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf');

        es.onmessage = function (event) {
            console.log(event);
        };

        var es2 = new EventSource(blocks);

        es2.onmessage = function (event) {
            console.log(event);
        };
    });*/

    /* it('listen to filtered plus outputFilter events', async () => {
        var es = new EventSource(url + '/filter?outputFilter=1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf');

        es.onmessage = function (event) {
            console.log(event);
        };

        var es2 = new EventSource(blocks);

        es2.onmessage = function (event) {
            console.log(event);
        };
    });*/


});

