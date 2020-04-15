# bitcoinfiles-sdk
> BitcoinFiles Javascript SDK
https://www.BitcoinFiles.org

Bitcoin Files and Block Service powered by the Bitcoin Files Protocol (`b://` files). Bitcoin SV is Bitcoin.

*Easily create files and store it on Bitcoin SV blockchain:*


## Installation and Usage

**Installation**
```sh
npm install bitcoinfiles-sdk --save
```

**Include**
```javascript
// Include the library
var bitcoinfiles = require('bitcoinfiles-sdk');
```

# Bitcoin File System

**Bitcoin Files and Block Delivery Service powered by the Bitcoin Files Protocol (`b://` files)**

**Links**:

- <a href='https://github.com/bitcoinfiles/bitcoinfiles-sdk'>Javascript SDK: bitcoinfiles-sdk</a>
- <a href='https://www.bitcoinfiles.org/'>www.bitcoinfiles.org</a>
- <a href='https://media.bitcoinfiles.org/'>Endpoint: media.bitcoinfiles.org</a>

## Get File

Get File by txid


```shell
curl https://media.bitcoinfiles.org/408d3b99a06afd01e1717d78a7a9d2ee1c08f59003022429ae9b0a66075dfd40
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getFile('408d3b99a06afd01e1717d78a7a9d2ee1c08f59003022429ae9b0a66075dfd40');
```

> The above command returns the raw bytes of the file

This endpoint retrieves bitcoin file at txid

### HTTP Request

`GET https://media.bitcoinfiles.org/408d3b99a06afd01e1717d78a7a9d2ee1c08f59003022429ae9b0a66075dfd40`

### URL Parameters

Parameter | Description
--------- | -----------
txid |  Txid of the file

## Get Transaction

Get file transaction by txid

```shell
curl https://media.bitcoinfiles.org/tx/408d3b99a06afd01e1717d78a7a9d2ee1c08f59003022429ae9b0a66075dfd40
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getTx('9aaf2ae7015fffee2f31c2ce071bd4cce76e668b65d3db0f30665a814dfda84e');
```

> The above command returns the transaction

This endpoint retrieves transaction at txid

### HTTP Request

`GET https://media.bitcoinfiles.org/9aaf2ae7015fffee2f31c2ce071bd4cce76e668b65d3db0f30665a814dfda84e`

### URL Parameters

Parameter | Description
--------- | -----------
txid |  Txid of the transaction

## Get Raw Transaction

Get file transaction by txid

```shell
curl https://media.bitcoinfiles.org/rawtx/408d3b99a06afd01e1717d78a7a9d2ee1c08f59003022429ae9b0a66075dfd40
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getTxRaw('9aaf2ae7015fffee2f31c2ce071bd4cce76e668b65d3db0f30665a814dfda84e');
```

> The above command returns the raw transaction

This endpoint retrieves transaction at txid

### HTTP Request

`GET https://media.bitcoinfiles.org/rawtx/9aaf2ae7015fffee2f31c2ce071bd4cce76e668b65d3db0f30665a814dfda84e`

### URL Parameters

Parameter | Description
--------- | -----------
txid |  Txid of the transaction

# Block Delivery Network

**Bitcoin Files and Block Delivery Service powered by the Bitcoin Files Protocol (`b://` files)**

**Links**:

- <a href='https://github.com/bitcoinfiles/bitcoinfiles-sdk'>Javascript SDK: bitcoinfiles-sdk</a>
- <a href='https://www.bitcoinfiles.org/'>www.bitcoinfiles.org</a>
- <a href='https://media.bitcoinfiles.org/'>Endpoint: media.bitcoinfiles.org</a>

## Get Blockchain Info

Get blockchain information

```shell
curl https://media.bitcoinfiles.org/blockchain/status
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getBlockchainInfo();
```

> The above command returns the blockchain info

```javascript
{"chain":"main","blocks":630756,"bestblockhash":"0000000000000000038445394e87e5103343f34f91da9f4c9fd1a754e5e16b31","difficulty":197513539700.0701,"mediantime":1586980990,"verificationprogress":0.9999899941505928,"chainwork":"000000000000000000000000000000000000000001060b7473a70fece894e1fa"}
```

This endpoint retrieves blockchain info status

### HTTP Request

`GET https://media.bitcoinfiles.org/blockchain/status`


## Get Block

Get block by blockhash

```shell
curl https://media.bitcoinfiles.org/block/00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getBlock('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550');
```

> The above command returns the block

```javascript
{
   "header":{
      "hash":"00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550",
      "version":1,
      "prevHash":"00000000314e90489514c787d615cea50003af2023796ccdd085b6bcc1fa28f5",
      "merkleRoot":"2f5c03ce19e9a855ac93087a1b68fe6592bcf4bd7cbb9c1ef264d886a785894e",
      "time":1231609477,
      "bits":486604799,
      "nonce":2093702200,
      "height":43
   },
   "tx":[
      {
         "hash":"2f5c03ce19e9a855ac93087a1b68fe6592bcf4bd7cbb9c1ef264d886a785894e",
         "version":1,
         "inputs":[
            {
               "prevTxId":"0000000000000000000000000000000000000000000000000000000000000000",
               "outputIndex":4294967295,
               "sequenceNumber":4294967295,
               "script":"04ffff001d0116"
            }
         ],
         "outputs":[
            {
               "satoshis":5000000000,
               "script":"410492ade9a7a1fde25016c02d223e2f1c501d2af11b492e0a3f0cd617a01798c5f5eabd9d5957a7b2d66d1b42f688a6fd5d2bc60ad0d7a00f6006fc4838fb4c248aac"
            }
         ],
         "nLockTime":0
      }
   ],
   "block":{
      "header":{
         "hash":"00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550",
         "version":1,
         "prevHash":"00000000314e90489514c787d615cea50003af2023796ccdd085b6bcc1fa28f5",
         "merkleRoot":"2f5c03ce19e9a855ac93087a1b68fe6592bcf4bd7cbb9c1ef264d886a785894e",
         "time":1231609477,
         "bits":486604799,
         "nonce":2093702200
      },
      "transactions":[
         {
            "hash":"2f5c03ce19e9a855ac93087a1b68fe6592bcf4bd7cbb9c1ef264d886a785894e",
            "version":1,
            "inputs":[
               {
                  "prevTxId":"0000000000000000000000000000000000000000000000000000000000000000",
                  "outputIndex":4294967295,
                  "sequenceNumber":4294967295,
                  "script":"04ffff001d0116"
               }
            ],
            "outputs":[
               {
                  "satoshis":5000000000,
                  "script":"410492ade9a7a1fde25016c02d223e2f1c501d2af11b492e0a3f0cd617a01798c5f5eabd9d5957a7b2d66d1b42f688a6fd5d2bc60ad0d7a00f6006fc4838fb4c248aac"
               }
            ],
            "nLockTime":0
         }
      ]
   }
}
```

This endpoint retrieves block at blockhash

### HTTP Request

`GET https://media.bitcoinfiles.org/block/00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550`

### URL Parameters

Parameter | Description
--------- | -----------
blockhash |  Blockhash of the block

## Get Raw Block

Get raw block by blockhash

```shell
curl https://media.bitcoinfiles.org/rawblock/00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getBlockRaw('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550');
```

> The above command returns the block

```
01000000f528fac1bcb685d0cd6c792320af0300a5ce15d687c7149548904e31000000004e8985a786d864f21e9cbb7cbdf4bc9265fe681b7a0893ac55a8e919ce035c2f85de6849ffff001d385ccb7c0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0116ffffffff0100f2052a0100000043410492ade9a7a1fde25016c02d223e2f1c501d2af11b492e0a3f0cd617a01798c5f5eabd9d5957a7b2d66d1b42f688a6fd5d2bc60ad0d7a00f6006fc4838fb4c248aac00000000

```

This endpoint retrieves raw block at blockhash

### HTTP Request

`GET https://media.bitcoinfiles.org/rawblock/00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550`

### URL Parameters

Parameter | Description
--------- | -----------
blockhash |  Blockhash of the block


## Get Filtered Block

Get raw transactions filtered within a block.

Specify an arbitrary hex string to match anywhere in a transaction.

You can do logical OR by piping multiple hex sequences togther.

Example 1:

'01234|66666' will match all transactions in a block that have `01234` or `66666` appearing somewhere in the raw transaction.

`747765746368` is the word 'twetch' and you can find all transactions that have that string anywhere.

Example 2:

'0123.+88|447755' matches all transactions that have `0123` pattern with anything in between followed by an `88` OR `447755`
is found anywhere in the transaction.

```shell
curl https://media.bitcoinfiles.org/block/00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177/filter/747765746368
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getBlockFiltered('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550', '0123456|747765746368');

const result2 = await bitcoinfiles.getBlockFiltered('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550', '0123.+88|447755');
```

> The above command returns the filtered

```
[ "0100000001d95b67b533205196cde0bd42f4cc139fa4eff968347fe57c28b06e8495cc8157040000006b483045022100f8181bfa7c18da1460be22a81e3866740fc60261e0bb3ce1f78736371358f96d0220554e6eb8a3ff68e2c51aee2d096045f5a8fe99e3f69c9cca0673edbe798a1a8b4121030a548df8f30d0bfb0499c4be4a287a2bd5a42599cea14e75ff1a3e822766867effffffff050000000000000000fd0101006a22314c6f6f6b79327976626a576958453631456862395333337745327744534c566a44067477657463682432383134623563392d356439392d343930302d616538612d656163653039623062366462017c22313550636948473232534e4c514a584d6f53556157566937575371633768436676610d424954434f494e5f454344534122314e58544835356d336e566f504c757a47526b6b616b65736d58433341726d5544534c58494d3249346d74356d4e5174652b30594864454c42363662754c39427a776562656457792b486b637345306e59473336366c59426b4b6278464b632f476e58592b6e624c6355354f444c516e584554745265446e334d6b3d79cc0000000000001976a9143816920e94f43f603cae571b545203aec4516a3788ac79cc0000000000001976a914c23979eba63d6b5941145316618acabe83735cfb88acc8630600000000001976a91405186ff0710ed004229e644c0653b2985c648a2388ac4baff239000000001976a914264fb2bb20ec9a627c6dbeb3ba51534847ec4c3e88ac00000000",
...
]

```

This endpoint retrieves filtered block at blockhash

### HTTP Request

`GET https://media.bitcoinfiles.org/block/00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177/filter/747765746368|0123`

### URL Parameters

Parameter | Description
--------- | -----------
blockhash |  Blockhash of the block
filterStr |  Filter string to match in hex in the block. You can use a pipe | to seperate with logical OR to match any of them.


## Get Blockheader

Get blockheader by blockhash

```shell
curl https://media.bitcoinfiles.org/blockheader/00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getBlockHeader('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550');
```

> The above command returns the blockheader

```javascript

{
   "hash":"00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550",
   "height":43,
   "version":1,
   "versionHex":"00000001",
   "merkleroot":"2f5c03ce19e9a855ac93087a1b68fe6592bcf4bd7cbb9c1ef264d886a785894e",
   "time":1231609477,
   "mediantime":1231607488,
   "nonce":2093702200,
   "bits":"1d00ffff",
   "difficulty":1,
   "chainwork":"0000000000000000000000000000000000000000000000000000002c002c002c",
   "previousblockhash":"00000000314e90489514c787d615cea50003af2023796ccdd085b6bcc1fa28f5",
   "nextblockhash":"000000002978eecde8d020f7f057083bc990002fff495121d7dc1c26d00c00f8"
}

```

This endpoint retrieves blockheader at blockhash

### HTTP Request

`GET https://media.bitcoinfiles.org/blockheader/00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550`

### URL Parameters

Parameter | Description
--------- | -----------
blockhash |  Blockhash of the blockheader


## Get Raw Blockheader

Get raw blockheader by blockhash

```shell
curl https://media.bitcoinfiles.org/rawblockheader/00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getBlockheaderRaw('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550');
```

> The above command returns the blockheader

```
01000000f528fac1bcb685d0cd6c792320af0300a5ce15d687c7149548904e31000000004e8985a786d864f21e9cbb7cbdf4bc9265fe681b7a0893ac55a8e919ce035c2f85de6849ffff001d385ccb7c

```

This endpoint retrieves raw blockheader at blockhash

### HTTP Request

`GET https://media.bitcoinfiles.org/rawblockheader/00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550`

### URL Parameters

Parameter | Description
--------- | -----------
blockhash |  Blockhash of the blockheader



## Get Blockhash by Height

Get blockhash by height

```shell
curl https://media.bitcoinfiles.org/height/43322
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getBlockHash(43322);
```

> The above command returns the blockhash

```javascript
{ "blockhash": "000000002fef20817c904075a8821c2c5e5e3d602347c8a9d02b708fa9e90109" }

```

This endpoint retrieves blockhash at height

### HTTP Request

`GET https://media.bitcoinfiles.org/height/43322`

### URL Parameters

Parameter | Description
--------- | -----------
height |  Height of the blockhash to get



## Build and Test

```
npm run build
npm test
```

## Any questions?

We love to hear from you!
https://www.BitcoinFiles.org

https://www.matterpool.io


