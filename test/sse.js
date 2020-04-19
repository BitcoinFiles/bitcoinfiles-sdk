'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var EventSource = require('eventsource');

var url = 'https://stream.bitcoinfiles.org/mempool';
var blocks = 'https://stream.bitcoinfiles.org/blockheaders';
describe('sse', () => {
   /* it('listen to events', async () => {
        var es = new EventSource(url + '?filter=747765746368');

        es.onmessage = function (event) {
            console.log(event);
        };

        var es2 = new EventSource(blocks);

        es2.onmessage = function (event) {
            console.log(event);
        };

    });*/
});

