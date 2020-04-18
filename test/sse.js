'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var EventSource = require('eventsource');

var url = 'https://stream.bitcoinfiles.org/events';
describe('sse', () => {
    // Todo
    it('listen to events', async () => {
        var es = new EventSource(url + '?filter=747765746368');

        es.onmessage = function (event) {
            console.log('event', event);
        };

        es.addEventListener('any', function (event) {
            console.log('eventName', eventName, event);
        });
    });
});

