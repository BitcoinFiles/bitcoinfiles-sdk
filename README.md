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


