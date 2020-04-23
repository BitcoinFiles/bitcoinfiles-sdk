'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var axios = require('axios');

const options = {
    bitcoinfiles_api_base: 'http://localhost:8082',
}

describe('crawler', () => {
    it('Can query for blockchain info', async () => {

        const monitoring = [
            '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'
        ];
        /*
        index.on("mempool", ['19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'], async (tx) => {
            process.stdout.write("m");
            const hasMonitored = await processTxOutputs(tx, 0);
            if (hasMonitored) {
            monitoredTxs.push(true);
            }
        });*/
    });

    it('Can query for blockchain info', async () => {

        const monitoring = [
            '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'
        ];
        let height = 0;

        axios.get(`https://media.bitcoinfiles.org/height/${height}`, {
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(monitoring)
        })
        .then((res) => {
            console.log('res', res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    });
});

