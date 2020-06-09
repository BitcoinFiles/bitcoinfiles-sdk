'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');
const options = {
    api_base: 'http://localhost:8082',
    media_base: 'http://localhost:8082',
    // stream_base: 'http://localhost:8083',
}

describe('queueFile', () => {

    it('should queue File', async () => {
        var queueRequest = {
            file: {
                content: '<h1>Hello</h1>',
                contentType: 'text/html',
                encoding: 'utf8', // 'hex', 'utf8', 'base64'
                name: 'mytesth',
            },
            session_tag: 'a-session-random-identifier-folder-name',
        };
        var result = await index.queueFile(queueRequest, null, options);
        expect(result.success).to.equal(true);
        /*
        Example:
        {
      -  "message": {
      -    "location": "https://bitcoinfilesmatter.s3.amazonaws.com/mytesth.htmlff6bf8d0-8f3b-11ea-9b3b-4fba92b5e5b2.html"
      -    "payment_address": "1QGSAUaqm6PRZ9AVtvRnENfAJgQmUVa2Rj"
      -    "payment_satoshis": 2008
      -    "session_tag": "27002ba3-27b6-4528-94de-0edda7b3ad32"
      -    "status_fqdn": "https://api.bitcoinfiles.org/status/27002ba3-27b6-4528-94de-0edda7b3ad32"
      -    "status_url": "/status/27002ba3-27b6-4528-94de-0edda7b3ad32"
      -  }
      -  "success": true
      -}
        */
    });

});