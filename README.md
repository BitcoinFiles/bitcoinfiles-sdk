# bitcoinfiles-sdk
> BitcoinFiles Javascript SDK
> https://www.BitcoinFiles.org
> Documentation: https://developers.matterpool.io/#bitcoin-file-system

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

## Queue File Upload

You can queue large files to be uploaded after paying the `payment_sats_needed` to the `payment_address`.

For files smaller than 99KB see the method `createFile`

```shell
 var queueRequest = {
      file: {
          content: '<h1>Hello</h1>',
          contentType: 'text/html',
          encoding: 'utf8', // 'hex', 'utf8', 'base64'
          name: 'mytestfile.html',
      }
      //, session_tag: 'a-random-uuid-you-can-use-as-a-folder'
  };
  var result = await bitcoinfiles.queueFile(queueRequest);

/*
{
   "success":true,
   "result":[
      {
         "id":2613,
         "session_tag":"5d57b244-91a4-4cb6-ae98-c6e0e4b29e91",
         "payment_address":"1A11zmKhqP29y8GjrzcssFNRoqiBWcWSNa",
         "filename":"mytesth.falsee38ee790-8f3a-11ea-bb89-2bd752d34d1a.false",
         "first_broadcast_time":null,
         "last_broadcast_time":null,
         "payment_sats_needed":2008,
         "txid":null,
         "fileurl":"https://bitcoinfilesmatter.s3.amazonaws.com/mytesth.falsee38ee790-8f3a-11ea-bb89-2bd752d34d1a.false",
         "filesize":14,
         "blockhash":null,
         "created_time":1588729369
      }
   ]
}
*/
```

```javascript
  var queueRequest = {
      file: {
          content: '<h1>Hello</h1>',
          contentType: 'text/html',
          encoding: 'utf8', // 'hex', 'utf8', 'base64'
          name: 'mytestfile.html',
      }
      //, session_tag: 'a-random-uuid-you-can-use-as-a-folder'
  };
  var result = await bitcoinfiles.queueFile(queueRequest);

/*
{
   "success":true,
   "result":[
      {
         "id":2613,
         "session_tag":"5d57b244-91a4-4cb6-ae98-c6e0e4b29e91",
         "payment_address":"1A11zmKhqP29y8GjrzcssFNRoqiBWcWSNa",
         "filename":"mytesth.falsee38ee790-8f3a-11ea-bb89-2bd752d34d1a.false",
         "first_broadcast_time":null,
         "last_broadcast_time":null,
         "payment_sats_needed":2008,
         "txid":null,
         "fileurl":"https://bitcoinfilesmatter.s3.amazonaws.com/mytesth.falsee38ee790-8f3a-11ea-bb89-2bd752d34d1a.false",
         "filesize":14,
         "blockhash":null,
         "created_time":1588729369
      }
   ]
}
*/
```

This endpoint queues a file to be uploaded after the `payment_address` is paid with `payment_sats_needed`


## Create File

Create andn publish a file transaction directly on BSV blockchain.

Note: This is used to broadcast directly (files smaller than 99KB).

For files large than 99KB see the method `queueFile`

```shell
 var createRequest = {
      file: {
          content: 'Hello world!',
          contentType: 'text/plain',
      },
      pay: {
          key: privateKey
      }
  };
  var result = await bitcoinfiles.createFile(createRequest);
```

```javascript
  var createRequest = {
      file: {
          content: 'Hello world!',
          contentType: 'text/plain',
      },
      pay: {
          key: privateKey
      }
  };
  var result = await bitcoinfiles.createFile(createRequest);

```

This endpoint broadcasts a file transaction to the blockchain directly.

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

## Get Transaction (Optional Block and Merkle path)

Get file transaction by txid.

Options:

- `inputInfo=1` to retrieve the satoshis, address, and lockingScript for each vin.
- `includeBlock=1` to retrieve block and merkle info if tx is mined.
- `raw=1` to return the raw tx hex and raw block hex instead of JSON

```shell
curl https://media.bitcoinfiles.org/tx/408d3b99a06afd01e1717d78a7a9d2ee1c08f59003022429ae9b0a66075dfd40?inputInfo=true&includeBlock=1&raw=0

```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getTx('633fc9e55db4039d5b48df8aab31cd2366d98d64285fdc2aa53c17aa895b476e', null, {
  includeBlock: true,
  raw: false,
  inputInfo: true });

```

> The above command returns the transaction

```shell
{
   "hash":"9aaf2ae7015fffee2f31c2ce071bd4cce76e668b65d3db0f30665a814dfda84e",
   "version":1,
   "inputs":[
      {
         "prevTxId":"7a5ea5b0893d44084c8741c919f9555112f6f34f3966eed1c3cd937620a1aa66",
         "outputIndex":1,
         "sequenceNumber":4294967294,
         "script":"47304402207be7bf327a2c1412b0773ca878da5822564d798cb893549a68b020b23b9412380220069283eafe72e2e66d155dbe50a54925355dca10dff772377d7c7272907ed1f4412103aaed350d46c047f2dfc8c1e3b69e88552d35d79c3c589fbf32fe4216a8b59057",
         "scriptString":"71 0x304402207be7bf327a2c1412b0773ca878da5822564d798cb893549a68b020b23b9412380220069283eafe72e2e66d155dbe50a54925355dca10dff772377d7c7272907ed1f441 33 0x03aaed350d46c047f2dfc8c1e3b69e88552d35d79c3c589fbf32fe4216a8b59057",
         "satoshis":9670,
         "address":"15MypiVWwY1dEpkEEviLSqRi7ySW5cfJMV",
         "lockingScript":"76a9142fd8416c04c42df9808bd6525d0cdab1d27ce28088ac"
      }
   ],
   "outputs":[
      {
         "satoshis":208300000,
         "script":"76a914239880104dbe3f5d34364f57b5e9c794135468ea88ac"
      },
      {
         "satoshis":657898800,
         "script":"76a91458e87ba0ea87ed590031a4e7f3ee1b85713aa87688ac"
      }
   ],
   "nLockTime":630519
}

// With block information: https://media.bitcoinfiles.org/tx/9bebc37a1bd107c3ade78793a062312041e91d377b62548e9124d4e1b8df2a1b?includeBlock=1&raw=0&inputInfo=1
{
   "tx":{
      "hash":"9bebc37a1bd107c3ade78793a062312041e91d377b62548e9124d4e1b8df2a1b",
      "version":1,
      "inputs":[
         {
            "prevTxId":"1f6486d1e9f60878d682bd17ae3be44b62b6d8577ac6f4deff7f654748c5327f",
            "outputIndex":1,
            "sequenceNumber":4294967295,
            "script":"483045022100a13deebd441a79d8dfc32010b42a9094aad26cb61966d200730c53acc3d6a54802206ab4b652c723017b0bf405cbbabf1055c4970b5fbb3027e39d7d7039d4aefd92412103023f7579161115a5b2eba387c12dd88b636ab15ffaa6e7c93bcbd1e36b2a367a",
            "scriptString":"72 0x3045022100a13deebd441a79d8dfc32010b42a9094aad26cb61966d200730c53acc3d6a54802206ab4b652c723017b0bf405cbbabf1055c4970b5fbb3027e39d7d7039d4aefd9241 33 0x03023f7579161115a5b2eba387c12dd88b636ab15ffaa6e7c93bcbd1e36b2a367a",
            "satoshis":13600000,
            "address":"13nM162gxnaZx89Wm9kdRGAQS89FVFkF6a",
            "lockingScript":"76a9141e83aa8fb461dd16319ad0548a5b443f56ee881b88ac"
         }
      ],
      "outputs":[
         {
            "satoshis":7840000,
            "script":"76a914463300d931e7d7dffff49cb2b0be3836386d441b88ac",
            "outputIndex":0,
            "address":"17QBQCdZCfn1wMAT1NpfJeLTRYwdyxGV1X"
         },
         {
            "satoshis":5759547,
            "script":"76a9146a972de3b20b99cde820a323735ab0ef8f7b889d88ac",
            "outputIndex":1,
            "address":"1AibjTGQBdWMtxPEDtv75eLsNGzuzoEFTs"
         }
      ],
      "nLockTime":0
   },
   "block":{
      "header":{
         "hash":"000000000000000003a95a5dcc1779b6e08fd24e6c88dc2843bbcb2f7257cc18",
         "version":671080448,
         "prevHash":"0000000000000000036801b2a04c2013b0a1b096eff7449963e8e5e7c544b259",
         "merkleRoot":"299c76dfd47b382319394a167127aaf41ae68c82565499782dd88d162a0f808c",
         "time":1590342076,
         "bits":402913836,
         "nonce":2183222916
      },
      "numTransactions":7288,
      "hashes":[
         "37e8816ba1ad8a5cbf615055d10103f75b594d35830e6a012c61b3725ee00e75",
         "1b2adfb8e1d424918e54627b371de941203162a09387e7adc307d11b7ac3eb9b",
         "bd6d5190117406a668edf88ba720da654de502cafca6c39746445a88f6da33f4",
         "6988d1c48a896efc0c8f98263f7a6b9dcc402769fa979b43fb7150c01d19c770",
         "8b71a1fb94efefed891eed4316d0644d82280e6ad3fbcc06ca93793cff3bf2c9",
         "cbb77fc4a2f8e2d884b9e0682fbafe13dc07eca2f9b84c05ea4104b586f364b5",
         "08a1cb5a5c4cbaeca8b7d4ea6464bd7bad73a82fce1a58c65c3da9db12c6c42a",
         "af1574d69fb46f15ad4147b77d301ef074eb8f17baf2a5614f1b4cc5c6de4418",
         "992146b6d5cb21c3bb6bb93b7cd1ffa5bd9388125aee91c6c472f0c17051ca4e",
         "db94c52778da8a45a01e079a0fe8e47d475bbf2c3270527ccfb67f7b175f0d20",
         "505e01d30a4b7aa66e32916ea69982a813bb59596759167a86b1ec5d7eb211a8",
         "9a06d2005db28fb7339980c902f51e53293af967d910d56eed95883f2c308943",
         "e2acbeab45f83b7b010e90653ff642db5c57e7ea040d56436822c0a89f41821e",
         "197ce9b68a71b63ca728f8df1865ff567a07a57ac16510e4d0038b0e6269df5a"
      ],
      "flags":[
         255,
         119,
         0,
         0
      ]
   }
}

```


```javascript
{
   "hash":"9aaf2ae7015fffee2f31c2ce071bd4cce76e668b65d3db0f30665a814dfda84e",
   "version":1,
   "inputs":[
      {
         "prevTxId":"7a5ea5b0893d44084c8741c919f9555112f6f34f3966eed1c3cd937620a1aa66",
         "outputIndex":1,
         "sequenceNumber":4294967294,
         "script":"47304402207be7bf327a2c1412b0773ca878da5822564d798cb893549a68b020b23b9412380220069283eafe72e2e66d155dbe50a54925355dca10dff772377d7c7272907ed1f4412103aaed350d46c047f2dfc8c1e3b69e88552d35d79c3c589fbf32fe4216a8b59057",
         "scriptString":"71 0x304402207be7bf327a2c1412b0773ca878da5822564d798cb893549a68b020b23b9412380220069283eafe72e2e66d155dbe50a54925355dca10dff772377d7c7272907ed1f441 33 0x03aaed350d46c047f2dfc8c1e3b69e88552d35d79c3c589fbf32fe4216a8b59057",
         "satoshis":9670,
         "address":"15MypiVWwY1dEpkEEviLSqRi7ySW5cfJMV",
         "lockingScript":"76a9142fd8416c04c42df9808bd6525d0cdab1d27ce28088ac"
      }
   ],
   "outputs":[
      {
         "satoshis":208300000,
         "script":"76a914239880104dbe3f5d34364f57b5e9c794135468ea88ac"
      },
      {
         "satoshis":657898800,
         "script":"76a91458e87ba0ea87ed590031a4e7f3ee1b85713aa87688ac"
      }
   ],
   "nLockTime":630519
}

// With block information: https://media.bitcoinfiles.org/tx/9bebc37a1bd107c3ade78793a062312041e91d377b62548e9124d4e1b8df2a1b?includeBlock=1&raw=0&inputInfo=1
{
   "tx":{
      "hash":"9bebc37a1bd107c3ade78793a062312041e91d377b62548e9124d4e1b8df2a1b",
      "version":1,
      "inputs":[
         {
            "prevTxId":"1f6486d1e9f60878d682bd17ae3be44b62b6d8577ac6f4deff7f654748c5327f",
            "outputIndex":1,
            "sequenceNumber":4294967295,
            "script":"483045022100a13deebd441a79d8dfc32010b42a9094aad26cb61966d200730c53acc3d6a54802206ab4b652c723017b0bf405cbbabf1055c4970b5fbb3027e39d7d7039d4aefd92412103023f7579161115a5b2eba387c12dd88b636ab15ffaa6e7c93bcbd1e36b2a367a",
            "scriptString":"72 0x3045022100a13deebd441a79d8dfc32010b42a9094aad26cb61966d200730c53acc3d6a54802206ab4b652c723017b0bf405cbbabf1055c4970b5fbb3027e39d7d7039d4aefd9241 33 0x03023f7579161115a5b2eba387c12dd88b636ab15ffaa6e7c93bcbd1e36b2a367a",
            "satoshis":13600000,
            "address":"13nM162gxnaZx89Wm9kdRGAQS89FVFkF6a",
            "lockingScript":"76a9141e83aa8fb461dd16319ad0548a5b443f56ee881b88ac"
         }
      ],
      "outputs":[
         {
            "satoshis":7840000,
            "script":"76a914463300d931e7d7dffff49cb2b0be3836386d441b88ac",
            "outputIndex":0,
            "address":"17QBQCdZCfn1wMAT1NpfJeLTRYwdyxGV1X"
         },
         {
            "satoshis":5759547,
            "script":"76a9146a972de3b20b99cde820a323735ab0ef8f7b889d88ac",
            "outputIndex":1,
            "address":"1AibjTGQBdWMtxPEDtv75eLsNGzuzoEFTs"
         }
      ],
      "nLockTime":0
   },
   "block":{
      "header":{
         "hash":"000000000000000003a95a5dcc1779b6e08fd24e6c88dc2843bbcb2f7257cc18",
         "version":671080448,
         "prevHash":"0000000000000000036801b2a04c2013b0a1b096eff7449963e8e5e7c544b259",
         "merkleRoot":"299c76dfd47b382319394a167127aaf41ae68c82565499782dd88d162a0f808c",
         "time":1590342076,
         "bits":402913836,
         "nonce":2183222916
      },
      "numTransactions":7288,
      "hashes":[
         "37e8816ba1ad8a5cbf615055d10103f75b594d35830e6a012c61b3725ee00e75",
         "1b2adfb8e1d424918e54627b371de941203162a09387e7adc307d11b7ac3eb9b",
         "bd6d5190117406a668edf88ba720da654de502cafca6c39746445a88f6da33f4",
         "6988d1c48a896efc0c8f98263f7a6b9dcc402769fa979b43fb7150c01d19c770",
         "8b71a1fb94efefed891eed4316d0644d82280e6ad3fbcc06ca93793cff3bf2c9",
         "cbb77fc4a2f8e2d884b9e0682fbafe13dc07eca2f9b84c05ea4104b586f364b5",
         "08a1cb5a5c4cbaeca8b7d4ea6464bd7bad73a82fce1a58c65c3da9db12c6c42a",
         "af1574d69fb46f15ad4147b77d301ef074eb8f17baf2a5614f1b4cc5c6de4418",
         "992146b6d5cb21c3bb6bb93b7cd1ffa5bd9388125aee91c6c472f0c17051ca4e",
         "db94c52778da8a45a01e079a0fe8e47d475bbf2c3270527ccfb67f7b175f0d20",
         "505e01d30a4b7aa66e32916ea69982a813bb59596759167a86b1ec5d7eb211a8",
         "9a06d2005db28fb7339980c902f51e53293af967d910d56eed95883f2c308943",
         "e2acbeab45f83b7b010e90653ff642db5c57e7ea040d56436822c0a89f41821e",
         "197ce9b68a71b63ca728f8df1865ff567a07a57ac16510e4d0038b0e6269df5a"
      ],
      "flags":[
         255,
         119,
         0,
         0
      ]
   }
}


```

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

```shell
010000000166aaa1207693cdc3d1ee66394ff3f6125155f919c941874c08443d89b0a55e7a010000006a47304402207be7bf327a2c1412b0773ca878da5822564d798cb893549a68b020b23b9412380220069283eafe72e2e66d155dbe50a54925355dca10dff772377d7c7272907ed1f4412103aaed350d46c047f2dfc8c1e3b69e88552d35d79c3c589fbf32fe4216a8b59057feffffff02e0676a0c000000001976a914239880104dbe3f5d34364f57b5e9c794135468ea88ac30bd3627000000001976a91458e87ba0ea87ed590031a4e7f3ee1b85713aa87688acf79e0900
```

```javascript
010000000166aaa1207693cdc3d1ee66394ff3f6125155f919c941874c08443d89b0a55e7a010000006a47304402207be7bf327a2c1412b0773ca878da5822564d798cb893549a68b020b23b9412380220069283eafe72e2e66d155dbe50a54925355dca10dff772377d7c7272907ed1f4412103aaed350d46c047f2dfc8c1e3b69e88552d35d79c3c589fbf32fe4216a8b59057feffffff02e0676a0c000000001976a914239880104dbe3f5d34364f57b5e9c794135468ea88ac30bd3627000000001976a91458e87ba0ea87ed590031a4e7f3ee1b85713aa87688acf79e0900
```

This endpoint retrieves transaction at txid

### HTTP Request

`GET https://media.bitcoinfiles.org/tx/9aaf2ae7015fffee2f31c2ce071bd4cce76e668b65d3db0f30665a814dfda84e/raw`

### URL Parameters

Parameter | Description
--------- | -----------
txid |  Txid of the transaction

## Get Transaction Merkle Proof

Get Transaction Merkle Proof

```shell
curl https://media.bitcoinfiles.org/txproof/77619dc16e80dbb795443bd3089335d62e8eabc30ed82b9d6bc68bf094076fb4
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getTxOutProof('77619dc16e80dbb795443bd3089335d62e8eabc30ed82b9d6bc68bf094076fb4');
```

> The above command returns the merkle proof of transaction (MerkleBlock)


```shell
{
   "header":{
      "hash":"000000000000000000049eb3ff753e223b0a1bce976137f8e9454c82c31f523f",
      "version":536870912,
      "prevHash":"000000000000000003eb1a34752e2aafe0cf9c93926caa54aedd30fe62c14c6e",
      "merkleRoot":"44ff80a9bdc2a15555bfdfcd637accf48aafdb27ebd4cd9d4c7c29aa9a0a019e",
      "time":1587248088,
      "bits":402960587,
      "nonce":2605488380
   },
   "numTransactions":9744,
   "hashes":[
      "d0c4eb3cdc2e35b387c2a2c9fee0dfa504482e033579c66d470dbee0e7894f25",
      "b46f0794f08bc66b9d2bd80ec3ab8e2ed6359308d33b4495b7db806ec19d6177",
      "34a2cd3bc26b815d29049aa333593ae92ad1ea02f75f9863fea69e9547707cc8",
      "366d88cfa8affdee442bad72626ccc7fd5285ea077e8b5b6e5bc9205d0a4ce12",
      "3a65ac66248cd643751d67ae022262d6c811ee45e13cc15757f79e5d119e3cec",
      "4cbf1068d82630cfe1a9612b864a6403d44eda3577550de845bf3f7805173fd5",
      "9560aa9eabdff4db8bd86d5c267d89a96d3953834a23697946855861aba8dce7",
      "b4cf3be1af1134fabe42d48eb89ffd85b7592d7c898a711eb74b53f5dafc4941",
      "094784d94ad265346b18850cf35b758d69a33541d68ddb10dfd846751df47560",
      "7c251822e97714f238ee4544ee5bb2e2923126b30be66b09b927dc8625d03df3",
      "88eb5e7460e9faa4961f077a39aea18a0983afaf99e9cea28ee724a45de0a3e8",
      "58662251d7c9f12dd59dd5f7165221c0531104396bbe717ca56a70edf9878dc9",
      "8599f2358f7fa6855ba41d125745aa646bbc6b81c00af26eeaca6c0c0e0dfbfc",
      "c710a24c4a7fc5b4aeda613ef08da68892816c1d6ff8d783c92290c8ba3bba81",
      "ccd11f375aa4047cc63f4de034fc7490f3f5448e5163df258688f2cef6bd13fb"
   ],
   "flags":[
      255,
      191,
      0,
      0
   ]
}
```

```javascript
{
   "header":{
      "hash":"000000000000000000049eb3ff753e223b0a1bce976137f8e9454c82c31f523f",
      "version":536870912,
      "prevHash":"000000000000000003eb1a34752e2aafe0cf9c93926caa54aedd30fe62c14c6e",
      "merkleRoot":"44ff80a9bdc2a15555bfdfcd637accf48aafdb27ebd4cd9d4c7c29aa9a0a019e",
      "time":1587248088,
      "bits":402960587,
      "nonce":2605488380
   },
   "numTransactions":9744,
   "hashes":[
      "d0c4eb3cdc2e35b387c2a2c9fee0dfa504482e033579c66d470dbee0e7894f25",
      "b46f0794f08bc66b9d2bd80ec3ab8e2ed6359308d33b4495b7db806ec19d6177",
      "34a2cd3bc26b815d29049aa333593ae92ad1ea02f75f9863fea69e9547707cc8",
      "366d88cfa8affdee442bad72626ccc7fd5285ea077e8b5b6e5bc9205d0a4ce12",
      "3a65ac66248cd643751d67ae022262d6c811ee45e13cc15757f79e5d119e3cec",
      "4cbf1068d82630cfe1a9612b864a6403d44eda3577550de845bf3f7805173fd5",
      "9560aa9eabdff4db8bd86d5c267d89a96d3953834a23697946855861aba8dce7",
      "b4cf3be1af1134fabe42d48eb89ffd85b7592d7c898a711eb74b53f5dafc4941",
      "094784d94ad265346b18850cf35b758d69a33541d68ddb10dfd846751df47560",
      "7c251822e97714f238ee4544ee5bb2e2923126b30be66b09b927dc8625d03df3",
      "88eb5e7460e9faa4961f077a39aea18a0983afaf99e9cea28ee724a45de0a3e8",
      "58662251d7c9f12dd59dd5f7165221c0531104396bbe717ca56a70edf9878dc9",
      "8599f2358f7fa6855ba41d125745aa646bbc6b81c00af26eeaca6c0c0e0dfbfc",
      "c710a24c4a7fc5b4aeda613ef08da68892816c1d6ff8d783c92290c8ba3bba81",
      "ccd11f375aa4047cc63f4de034fc7490f3f5448e5163df258688f2cef6bd13fb"
   ],
   "flags":[
      255,
      191,
      0,
      0
   ]
}
```

This endpoint retrieves tx merkle proof at txid

### HTTP Request

`GET https://media.bitcoinfiles.org/txproof/77619dc16e80dbb795443bd3089335d62e8eabc30ed82b9d6bc68bf094076fb4`

### URL Parameters

Parameter | Description
--------- | -----------
txid |  Txid of the transaction


## Get Raw Transaction Merkle Proof

Get Raw Transaction Merkle Proof

```shell
curl https://media.bitcoinfiles.org/txproof/77619dc16e80dbb795443bd3089335d62e8eabc30ed82b9d6bc68bf094076fb4/raw
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getTxOutProofString('77619dc16e80dbb795443bd3089335d62e8eabc30ed82b9d6bc68bf094076fb4');
```

> The above command returns the merkle proof of transaction (MerkleBlock)


```shell
000000206e4cc162fe30ddae54aa6c92939ccfe0af2a2e75341aeb0300000000000000009e010a9aaa297c4c9dcdd4eb27dbaf8af4cc7a63cddfbf5555a1c2bda980ff44d87b9b5ecbb00418fc984c9b102600000fd0c4eb3cdc2e35b387c2a2c9fee0dfa504482e033579c66d470dbee0e7894f25b46f0794f08bc66b9d2bd80ec3ab8e2ed6359308d33b4495b7db806ec19d617734a2cd3bc26b815d29049aa333593ae92ad1ea02f75f9863fea69e9547707cc8366d88cfa8affdee442bad72626ccc7fd5285ea077e8b5b6e5bc9205d0a4ce123a65ac66248cd643751d67ae022262d6c811ee45e13cc15757f79e5d119e3cec4cbf1068d82630cfe1a9612b864a6403d44eda3577550de845bf3f7805173fd59560aa9eabdff4db8bd86d5c267d89a96d3953834a23697946855861aba8dce7b4cf3be1af1134fabe42d48eb89ffd85b7592d7c898a711eb74b53f5dafc4941094784d94ad265346b18850cf35b758d69a33541d68ddb10dfd846751df475607c251822e97714f238ee4544ee5bb2e2923126b30be66b09b927dc8625d03df388eb5e7460e9faa4961f077a39aea18a0983afaf99e9cea28ee724a45de0a3e858662251d7c9f12dd59dd5f7165221c0531104396bbe717ca56a70edf9878dc98599f2358f7fa6855ba41d125745aa646bbc6b81c00af26eeaca6c0c0e0dfbfcc710a24c4a7fc5b4aeda613ef08da68892816c1d6ff8d783c92290c8ba3bba81ccd11f375aa4047cc63f4de034fc7490f3f5448e5163df258688f2cef6bd13fb04ffbf0000
```

```javascript
000000206e4cc162fe30ddae54aa6c92939ccfe0af2a2e75341aeb0300000000000000009e010a9aaa297c4c9dcdd4eb27dbaf8af4cc7a63cddfbf5555a1c2bda980ff44d87b9b5ecbb00418fc984c9b102600000fd0c4eb3cdc2e35b387c2a2c9fee0dfa504482e033579c66d470dbee0e7894f25b46f0794f08bc66b9d2bd80ec3ab8e2ed6359308d33b4495b7db806ec19d617734a2cd3bc26b815d29049aa333593ae92ad1ea02f75f9863fea69e9547707cc8366d88cfa8affdee442bad72626ccc7fd5285ea077e8b5b6e5bc9205d0a4ce123a65ac66248cd643751d67ae022262d6c811ee45e13cc15757f79e5d119e3cec4cbf1068d82630cfe1a9612b864a6403d44eda3577550de845bf3f7805173fd59560aa9eabdff4db8bd86d5c267d89a96d3953834a23697946855861aba8dce7b4cf3be1af1134fabe42d48eb89ffd85b7592d7c898a711eb74b53f5dafc4941094784d94ad265346b18850cf35b758d69a33541d68ddb10dfd846751df475607c251822e97714f238ee4544ee5bb2e2923126b30be66b09b927dc8625d03df388eb5e7460e9faa4961f077a39aea18a0983afaf99e9cea28ee724a45de0a3e858662251d7c9f12dd59dd5f7165221c0531104396bbe717ca56a70edf9878dc98599f2358f7fa6855ba41d125745aa646bbc6b81c00af26eeaca6c0c0e0dfbfcc710a24c4a7fc5b4aeda613ef08da68892816c1d6ff8d783c92290c8ba3bba81ccd11f375aa4047cc63f4de034fc7490f3f5448e5163df258688f2cef6bd13fb04ffbf0000
```

This endpoint retrieves raw tx merkle proof at txid

### HTTP Request

`GET https://media.bitcoinfiles.org/txproof/77619dc16e80dbb795443bd3089335d62e8eabc30ed82b9d6bc68bf094076fb4/raw`

### URL Parameters

Parameter | Description
--------- | -----------
txid |  Txid of the transaction

## Verify Transaction Merkle Proof

Verify Raw Transaction Merkle Proof (Merkle Block)

```shell
curl https://media.bitcoinfiles.org/txproof/verify/000000206e4cc162fe30ddae54aa6c92939ccfe0af2a2e75341aeb0300000000000000009e010a9aaa297c4c9dcdd4eb27dbaf8af4cc7a63cddfbf5555a1c2bda980ff44d87b9b5ecbb00418fc984c9b102600000fd0c4eb3cdc2e35b387c2a2c9fee0dfa504482e033579c66d470dbee0e7894f25b46f0794f08bc66b9d2bd80ec3ab8e2ed6359308d33b4495b7db806ec19d617734a2cd3bc26b815d29049aa333593ae92ad1ea02f75f9863fea69e9547707cc8366d88cfa8affdee442bad72626ccc7fd5285ea077e8b5b6e5bc9205d0a4ce123a65ac66248cd643751d67ae022262d6c811ee45e13cc15757f79e5d119e3cec4cbf1068d82630cfe1a9612b864a6403d44eda3577550de845bf3f7805173fd59560aa9eabdff4db8bd86d5c267d89a96d3953834a23697946855861aba8dce7b4cf3be1af1134fabe42d48eb89ffd85b7592d7c898a711eb74b53f5dafc4941094784d94ad265346b18850cf35b758d69a33541d68ddb10dfd846751df475607c251822e97714f238ee4544ee5bb2e2923126b30be66b09b927dc8625d03df388eb5e7460e9faa4961f077a39aea18a0983afaf99e9cea28ee724a45de0a3e858662251d7c9f12dd59dd5f7165221c0531104396bbe717ca56a70edf9878dc98599f2358f7fa6855ba41d125745aa646bbc6b81c00af26eeaca6c0c0e0dfbfcc710a24c4a7fc5b4aeda613ef08da68892816c1d6ff8d783c92290c8ba3bba81ccd11f375aa4047cc63f4de034fc7490f3f5448e5163df258688f2cef6bd13fb04ffbf0000
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.verifyTxOutProofString('77619dc16e80dbb795443bd3089335d62e8eabc30ed82b9d6bc68bf094076fb4');
```

> This endpoint verifies the merkle block and returns which txids it commits to (MerkleBlock)


```shell
["77619dc16e80dbb795443bd3089335d62e8eabc30ed82b9d6bc68bf094076fb4"]
```

```javascript
["77619dc16e80dbb795443bd3089335d62e8eabc30ed82b9d6bc68bf094076fb4"]
```

This endpoint verifies the merkle block and returns which txids it commits to

### HTTP Request

`GET https://media.bitcoinfiles.org/txproof/verify/000000206e4cc162fe30ddae54aa6c92939ccfe0af2a2e75341aeb0300000000000000009e010a9aaa297c4c9dcdd4eb27dbaf8af4cc7a63cddfbf5555a1c2bda980ff44d87b9b5ecbb00418fc984c9b102600000fd0c4eb3cdc2e35b387c2a2c9fee0dfa504482e033579c66d470dbee0e7894f25b46f0794f08bc66b9d2bd80ec3ab8e2ed6359308d33b4495b7db806ec19d617734a2cd3bc26b815d29049aa333593ae92ad1ea02f75f9863fea69e9547707cc8366d88cfa8affdee442bad72626ccc7fd5285ea077e8b5b6e5bc9205d0a4ce123a65ac66248cd643751d67ae022262d6c811ee45e13cc15757f79e5d119e3cec4cbf1068d82630cfe1a9612b864a6403d44eda3577550de845bf3f7805173fd59560aa9eabdff4db8bd86d5c267d89a96d3953834a23697946855861aba8dce7b4cf3be1af1134fabe42d48eb89ffd85b7592d7c898a711eb74b53f5dafc4941094784d94ad265346b18850cf35b758d69a33541d68ddb10dfd846751df475607c251822e97714f238ee4544ee5bb2e2923126b30be66b09b927dc8625d03df388eb5e7460e9faa4961f077a39aea18a0983afaf99e9cea28ee724a45de0a3e858662251d7c9f12dd59dd5f7165221c0531104396bbe717ca56a70edf9878dc98599f2358f7fa6855ba41d125745aa646bbc6b81c00af26eeaca6c0c0e0dfbfcc710a24c4a7fc5b4aeda613ef08da68892816c1d6ff8d783c92290c8ba3bba81ccd11f375aa4047cc63f4de034fc7490f3f5448e5163df258688f2cef6bd13fb04ffbf0000`

### URL Parameters

Parameter | Description
--------- | -----------
txid |  Txid of the transaction


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

```shell
{
   "chain":"main",
   "blocks":630756,
   "bestblockhash":"0000000000000000038445394e87e5103343f34f91da9f4c9fd1a754e5e16b31",
   "difficulty":197513539700.0701,
   "mediantime":1586980990,
   "verificationprogress":0.9999899941505928,
   "chainwork":"000000000000000000000000000000000000000001060b7473a70fece894e1fa"
}
```

```javascript
{
   "chain":"main",
   "blocks":630756,
   "bestblockhash":"0000000000000000038445394e87e5103343f34f91da9f4c9fd1a754e5e16b31",
   "difficulty":197513539700.0701,
   "mediantime":1586980990,
   "verificationprogress":0.9999899941505928,
   "chainwork":"000000000000000000000000000000000000000001060b7473a70fece894e1fa"
}
```

This endpoint retrieves blockchain info status

### HTTP Request

`GET https://media.bitcoinfiles.org/blockchain/status`


## Get Block

Get raw block by blockhash

```shell
curl https://media.bitcoinfiles.org/block/00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getBlock('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550');
```

> The above command returns the block

```shell
01000000f528fac1bcb685d0cd6c792320af0300a5ce15d687c7149548904e31000000004e8985a786d864f21e9cbb7cbdf4bc9265fe681b7a0893ac55a8e919ce035c2f85de6849ffff001d385ccb7c0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0116ffffffff0100f2052a0100000043410492ade9a7a1fde25016c02d223e2f1c501d2af11b492e0a3f0cd617a01798c5f5eabd9d5957a7b2d66d1b42f688a6fd5d2bc60ad0d7a00f6006fc4838fb4c248aac00000000

```

```javascript
01000000f528fac1bcb685d0cd6c792320af0300a5ce15d687c7149548904e31000000004e8985a786d864f21e9cbb7cbdf4bc9265fe681b7a0893ac55a8e919ce035c2f85de6849ffff001d385ccb7c0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0116ffffffff0100f2052a0100000043410492ade9a7a1fde25016c02d223e2f1c501d2af11b492e0a3f0cd617a01798c5f5eabd9d5957a7b2d66d1b42f688a6fd5d2bc60ad0d7a00f6006fc4838fb4c248aac00000000

```

This endpoint retrieves raw block at blockhash

### HTTP Request

`GET https://media.bitcoinfiles.org/block/00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550`

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
curl https://media.bitcoinfiles.org/block/00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177/tx/filter/747765746368

curl https://media.bitcoinfiles.org/block/00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177/tx/filter/747765746368|0123

curl https://media.bitcoinfiles.org/block/00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177/tx/filter?outputFilter=1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf,1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf


curl https://media.bitcoinfiles.org/block/00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177/tx/filter?outputFilterId=6fce8b16ae898ca5d403e3624813f41aee1f0a1bbf1a3c387c49a4af34699ad1
```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
const result = await bitcoinfiles.getBlockFiltered('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550', {
   base: '0123456|747765746368',
   outputFilter: null,
   outputFilterId: null
});

const result2 = await bitcoinfiles.getBlockFiltered('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550', {
   base: '0123.+88|447755',
   outputFilter: null,
   outputFilterId: null
});

const result3 = await bitcoinfiles.getBlockFiltered('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550', {
   base: null,
   outputFilter: ['1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf', 'deca84cc774cdb30152c46c6122daa9ebafafcc7f612b7bc9e5e44a01d03d2c5', 'deca84cc774cdb30152c46c6122daa9ebafafcc7f612b7bc9e5e44a01d03d2c5-0']
   outputFilterId: null
});

// Load up a filter created earlier with `saveOutputFilter`
const result4 = await bitcoinfiles.getBlockFiltered('00000000ac21f2862aaab177fd3c5c8b395de842f84d88c9cf3420b2d393e550', {
   outputFilterId: '6fce8b16ae898ca5d403e3624813f41aee1f0a1bbf1a3c387c49a4af34699ad1'
});
```

> The above command returns the filtered


```shell
{
   header: {
         "bits": 402963644,
         "hash": "0000000000000000010fa8e8773dbdb932e4a1c6ca4a3e67a2ed6313c435da6a",
         "merkleRoot": "2c8286bd5cea7340a4e5c5dce2b801d244af689841907a44482c35aad10c4084",
         "nonce": 3620922370,
         "prevHash": "00000000000000000075705dc13f5b1c5a10312585f28e07fa530ceacac201a6",
         "time": 1587614794,
         "version": 536870912,
   },

   tx: [
      {
         "h":"07eb6b63d4fc4d2e1bc4dcc0f50a365ec865dce7001099cc283a32917e2395b9","raw":"0100000001d95b67b533205196cde0bd42f4cc139fa4eff968347fe57c28b06e8495cc8157040000006b483045022100f8181bfa7c18da1460be22a81e3866740fc60261e0bb3ce1f78736371358f96d0220554e6eb8a3ff68e2c51aee2d096045f5a8fe99e3f69c9cca0673edbe798a1a8b4121030a548df8f30d0bfb0499c4be4a287a2bd5a42599cea14e75ff1a3e822766867effffffff050000000000000000fd0101006a22314c6f6f6b79327976626a576958453631456862395333337745327744534c566a44067477657463682432383134623563392d356439392d343930302d616538612d656163653039623062366462017c22313550636948473232534e4c514a584d6f53556157566937575371633768436676610d424954434f494e5f454344534122314e58544835356d336e566f504c757a47526b6b616b65736d58433341726d5544534c58494d3249346d74356d4e5174652b30594864454c42363662754c39427a776562656457792b486b637345306e59473336366c59426b4b6278464b632f476e58592b6e624c6355354f444c516e584554745265446e334d6b3d79cc0000000000001976a9143816920e94f43f603cae571b545203aec4516a3788ac79cc0000000000001976a914c23979eba63d6b5941145316618acabe83735cfb88acc8630600000000001976a91405186ff0710ed004229e644c0653b2985c648a2388ac4baff239000000001976a914264fb2bb20ec9a627c6dbeb3ba51534847ec4c3e88ac00000000"},
      ...
      }
   ]
}

```

```javasscript
{
   header: {
         "bits": 402963644,
         "hash": "0000000000000000010fa8e8773dbdb932e4a1c6ca4a3e67a2ed6313c435da6a",
         "merkleRoot": "2c8286bd5cea7340a4e5c5dce2b801d244af689841907a44482c35aad10c4084",
         "nonce": 3620922370,
         "prevHash": "00000000000000000075705dc13f5b1c5a10312585f28e07fa530ceacac201a6",
         "time": 1587614794,
         "version": 536870912,
   },

   tx: [
      {
         "h":"07eb6b63d4fc4d2e1bc4dcc0f50a365ec865dce7001099cc283a32917e2395b9","raw":"0100000001d95b67b533205196cde0bd42f4cc139fa4eff968347fe57c28b06e8495cc8157040000006b483045022100f8181bfa7c18da1460be22a81e3866740fc60261e0bb3ce1f78736371358f96d0220554e6eb8a3ff68e2c51aee2d096045f5a8fe99e3f69c9cca0673edbe798a1a8b4121030a548df8f30d0bfb0499c4be4a287a2bd5a42599cea14e75ff1a3e822766867effffffff050000000000000000fd0101006a22314c6f6f6b79327976626a576958453631456862395333337745327744534c566a44067477657463682432383134623563392d356439392d343930302d616538612d656163653039623062366462017c22313550636948473232534e4c514a584d6f53556157566937575371633768436676610d424954434f494e5f454344534122314e58544835356d336e566f504c757a47526b6b616b65736d58433341726d5544534c58494d3249346d74356d4e5174652b30594864454c42363662754c39427a776562656457792b486b637345306e59473336366c59426b4b6278464b632f476e58592b6e624c6355354f444c516e584554745265446e334d6b3d79cc0000000000001976a9143816920e94f43f603cae571b545203aec4516a3788ac79cc0000000000001976a914c23979eba63d6b5941145316618acabe83735cfb88acc8630600000000001976a91405186ff0710ed004229e644c0653b2985c648a2388ac4baff239000000001976a914264fb2bb20ec9a627c6dbeb3ba51534847ec4c3e88ac00000000"},
      ...
      }
   ]
}

```

This endpoint retrieves filtered block at blockhash

### HTTP Request

`GET https://media.bitcoinfiles.org/block/00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177/tx/filter/747765746368|0123`

`GET https://media.bitcoinfiles.org/block/00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177/tx/filter?outputFilter=1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf,1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf`


`GET https://media.bitcoinfiles.org/block/00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177/tx/filter?outputFilterId=6fce8b16ae898ca5d403e3624813f41aee1f0a1bbf1a3c387c49a4af34699ad1`

### URL Parameters

Parameter | Description
--------- | -----------
blockhash |  Blockhash of the block
filterStr |  Filter string to match in hex in the block. You can use a pipe | to seperate with logical OR to match any of them.
outputFilter |  Address, scripthash, txid or txout (`${txid}-${number}`) format to filter blocck
outputFilterId | outputFilterId returned by the outputFilter create API call



## Save Output Filter

Output Filters are a way to restrict your block and stream filters to select only those transactions that match the criteria.

You may specify addresses, p2pkh hex, scripthash, txid, and txoutpoints (txid-outputIndex).


```shell

curl -X POST https://api.bitcoinfiles.org/outputfilter -H 'Content-Type: application/json' \
-d '{ "add": ["12UhHtxuMMftNodp5nwoDYfBd4QaLm6Sz9"]}'

{
   "result": {
      // outputFilterId created
      "id": "8d2267f19a9e8524e3d253631e19bf163bcefb5de74e1ad86c36365afe2a3f87"
   },
   "success": true,
}

```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
// Monitor a few addresses, and txid and scripthash.
const saveResult = await bitcoinfiles.saveOutputFilter(
  [
         '12UhHtxuMMftNodp5nwoDYfBd4QaLm6Sz9',
         '12UhHtxuMMftNodp5nwoDYfBd4QaLm6Sz9', // automatically removes deduplicates
         '0c629d7b8069f917b7f31942db3ec94bf4c4662e17c05b1d5c059e448d1470af-2',
         '1ALSfdsAHraUzu8HhAE9Cep9ca1ju3fjt2',
         '65503f4f336d4528fec7e645f81f1bfd655e837e8460c33b677f6995955e0b95',
  ]
);
console.log(saveResult);
/*
{
   "result": {
      // outputFilterId created
      "id": "8d2267f19a9e8524e3d253631e19bf163bcefb5de74e1ad86c36365afe2a3f87"
   },
   "success": true,
}
*/
```

This endpoint creates an output filter that can be referenced in the block and stream filtering by outputFilterId

### HTTP Request

```shell

curl -X POST https://api.bitcoinfiles.org/outputfilter -H 'Content-Type: application/json' \
-d '{ "add": ["12UhHtxuMMftNodp5nwoDYfBd4QaLm6Sz9"]}'

```

### Body Parameters

Parameter | Description
--------- | -----------
add | Array of scripthash, address, txid, or txoutpoint for filtering


## Get Output Filter

Retrieve an output filter that was created earlier.  An output filter can be used in the outputFilterId parameter to block and stream filtering.

```shell

curl https://api.bitcoinfiles.org/outputfilter/8d2267f19a9e8524e3d253631e19bf163bcefb5de74e1ad86c36365afe2a3f87

[ '76a9141034fd8093641ae0741a0565fb7787bca1ac35fc88ac',
      '0c629d7b8069f917b7f31942db3ec94bf4c4662e17c05b1d5c059e448d1470af-2',
      '76a914666675d887a7ae09835af934096d9fcbbb70eed288ac',
      '65503f4f336d4528fec7e645f81f1bfd655e837e8460c33b677f6995955e0b95' ]

```

```javascript
const bitcoinfiles = require('bitcoinfiles-sdk');
// Monitor a few addresses, and txid and scripthash.
const result = await bitcoinfiles.getOutputFilter('8d2267f19a9e8524e3d253631e19bf163bcefb5de74e1ad86c36365afe2a3f87');
console.log(result);
/*
[ '76a9141034fd8093641ae0741a0565fb7787bca1ac35fc88ac',
      '0c629d7b8069f917b7f31942db3ec94bf4c4662e17c05b1d5c059e448d1470af-2',
      '76a914666675d887a7ae09835af934096d9fcbbb70eed288ac',
      '65503f4f336d4528fec7e645f81f1bfd655e837e8460c33b677f6995955e0b95' ]
*/
```

This endpoint gets an output filter that can be referenced in the block and stream filtering by outputFilterId

### HTTP Request

```shell

curl https://api.bitcoinfiles.org/outputfilter/8d2267f19a9e8524e3d253631e19bf163bcefb5de74e1ad86c36365afe2a3f87

```

### URL Parameters

Parameter | Description
--------- | -----------
outputFilterId | output filter identifier used during creation


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


```shell

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

```shell
01000000f528fac1bcb685d0cd6c792320af0300a5ce15d687c7149548904e31000000004e8985a786d864f21e9cbb7cbdf4bc9265fe681b7a0893ac55a8e919ce035c2f85de6849ffff001d385ccb7c

```

```javascript
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

```shell
{ "blockhash": "000000002fef20817c904075a8821c2c5e5e3d602347c8a9d02b708fa9e90109" }

```

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


# Socket Streaming (SSE)

BitcoinFiles supports real-time notifications with <a href='https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events'>Server Side Events (SSE)</a>

Endpoint: `https://stream.bitcoinfiles.org/mempool?filter=747765746368|012.*777`

Note: You must specify a `filter` parameter to filter the incoming transactions. The example above matches any transaction
that contains `747765746368` ('twetch' in hex) OR the pattern `012.*777` is found anywhere in the transaction.

The exact same filter syntax is supported as in the Block Delivery Service

Subscribe to the endpoint using any SSE library to start getting transaction and block notifications in real-time.

Links:
- <a href='https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events'>Server Side Events</a>
- <a href='https://www.npmjs.com/package/express-sse'>Node: express-sse</a>

Socket Streaming sessions are limited to 30 minutes. Ensure that you reconnect every 30 minutes to maintain your session.

## Transaction Events

Subscribe to receive notifications when new transactions in the mempool match your filter.

For example, to subscribe to all transactions that contains the word 'twetch', use this filter:

`https://stream.bitcoinfiles.org/mempool?filter=747765746368`

You can event combine filters and use simple regular expressions:

`https://stream.bitcoinfiles.org/mempool?filter=747765746368|012.*777`


Note: This endpoint for transactions **also returns the block notifications**. Make sure to check the message type to be 'tx'.
See BlockHeader Event for the format of the block header event

```shell
var es = new EventSource('https://stream.bitcoinfiles.org/mempool?filter=747765746368');

es.onmessage = function (event) {
    console.log('event', event);
};

// The event type is 'tx' and contains the txid and urls to access the transaction
// Note that if the transaction is less than 1,000 bytes, then it is also returned in the 'raw' field
// Otherwise the 'raw' is omitted and you can obtain the full transaction at one of the links provided.

// Additionally, if the file is a valid B:// file, then the 'file_url' is provided to the content
/*
{
  type: 'message',
  data:
   '{
    "type":"tx",
    "txid":"e6e5db1205775f9627208217e8d49dec3337fb1bfecb71918d66d8918ad7a99e",
    "rawtx_url":"https://media.bitcoinfiles.org/tx/e6e5db1205775f9627208217e8d49dec3337fb1bfecb71918d66d8918ad7a99e/raw",
    "tx_url":"https://media.bitcoinfiles.org/tx/e6e5db1205775f9627208217e8d49dec3337fb1bfecb71918d66d8918ad7a99e",
    "file_url":"https://media.bitcoinfiles.org/e6e5db1205775f9627208217e8d49dec3337fb1bfecb71918d66d8918ad7a99e",
    "raw": "....set to the raw tx bytes as long as the tx is less than 1,000 bytes total"
    }',
  lastEventId: '2',
  origin: 'https://stream.bitcoinfiles.org'
}
*/
```

```javascript
var es = new EventSource('https://stream.bitcoinfiles.org/mempool?filter=747765746368');

es.onmessage = function (event) {
    console.log('event', event);
};

// The event type is 'tx' and contains the txid and urls to access the transaction
// Note that if the transaction is less than 1,000 bytes, then it is also returned in the 'raw' field
// Otherwise the 'raw' is omitted and you can obtain the full transaction at one of the links provided.

// Additionally, if the file is a valid B:// file, then the 'file_url' is provided to the content
/*
{
  type: 'message',
  data:
   '{
    "type":"tx",
    "txid":"e6e5db1205775f9627208217e8d49dec3337fb1bfecb71918d66d8918ad7a99e",
    "rawtx_url":"https://media.bitcoinfiles.org/tx/e6e5db1205775f9627208217e8d49dec3337fb1bfecb71918d66d8918ad7a99e/raw",
    "tx_url":"https://media.bitcoinfiles.org/tx/e6e5db1205775f9627208217e8d49dec3337fb1bfecb71918d66d8918ad7a99e",
    "file_url":"https://media.bitcoinfiles.org/e6e5db1205775f9627208217e8d49dec3337fb1bfecb71918d66d8918ad7a99e",
    "raw": "....set to the raw tx bytes as long as the tx is less than 1,000 bytes total"
    }',
  lastEventId: '2',
  origin: 'https://stream.bitcoinfiles.org'
}
*/
```

## BlockHeader Events

Subscribe to listen for all new found blockheaders. You may obtain the full block using the Block Delivery Service if needed.


```shell
var es = new EventSource('https://stream.bitcoinfiles.org/blockheaders');

es.onmessage = function (event) {
    console.log('event', event);
};

// The event type is 'blockheader' and contains the blockheader that just arrived.
/*

{
  type: 'message',
  data:
   '{
     "type":"blockheader",
     "blockheader":{
       "hash":"000000000000000003b61bb7f1d9ada5e2b832ac55440914e7e86066345ca07c",
       "version":549453824,
       "prevHash":"0000000000000000034afd5abb1694ccb5574cd163381a60cc3c22e062710ed4","merkleRoot":"e4a18640ae54bc241aa404c86ee4aa74756242af2bdabf97ec9acee43c25751f",
       "time":1587189274,
       "bits":403014440,
       "nonce":1883442530,
       "height":631116
     }
     }',
  lastEventId: '1',
  origin: 'https://stream.bitcoinfiles.org' }

*/
```

```javascript
var es = new EventSource('https://stream.bitcoinfiles.org/blockheaders');

es.onmessage = function (event) {
    console.log('event', event);
};

// The event type is 'blockheader' and contains the blockheader that just arrived.
/*

{
  type: 'message',
  data:
   '{
     "type":"blockheader",
     "blockheader":{
       "hash":"000000000000000003b61bb7f1d9ada5e2b832ac55440914e7e86066345ca07c",
       "version":549453824,
       "prevHash":"0000000000000000034afd5abb1694ccb5574cd163381a60cc3c22e062710ed4","merkleRoot":"e4a18640ae54bc241aa404c86ee4aa74756242af2bdabf97ec9acee43c25751f",
       "time":1587189274,
       "bits":403014440,
       "nonce":1883442530,
       "height":631116
     }
     }',
  lastEventId: '1',
  origin: 'https://stream.bitcoinfiles.org' }

*/
```

# Blockchain Scanner

Synchronize the blockchain data to your application effortlessly.

Monitor the Bitcoin SV blockchain in real-time and crawl blocks matching your filters.

Scan the blockchain blocks and mempool for transactions matching base filter (hex regex), outputFilter array of addresses
scripthashes, txids, and txouts.

Note: If you need to monitor more than 20 items in the outputFilter, then use the `saveOutputFilter` and specify the `outputFilterId`.

The scanner uses the stream and media endpoints, it should be easy to build this same scanner in any other language.

Examples:

<a href='https://stream.bitcoinfiles.org/mempool/filter' target="_blank">Entire mempool</a>

<a href='https://stream.bitcoinfiles.org/mempool/filter?outputFilter=1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf' target="_blank">Twetch outputs in mempool</a>

<a href='https://stream.bitcoinfiles.org/mempool/filter/123' target="_blank">All outputs matching '123' in mempool</a>

With <a href='https://media.bitcoinfiles.org/outputfilter/8d2267f19a9e8524e3d253631e19bf163bcefb5de74e1ad86c36365afe2a3f87'>sample outputFilterId:</a>

<a href='https://stream.bitcoinfiles.org/mempool/filter?outputFilterId=8d2267f19a9e8524e3d253631e19bf163bcefb5de74e1ad86c36365afe2a3f87' target="_blank">All outputs matching saved output filter in mempool</a>

Note: the output filter stores an address like `12UhHtxuMMftNodp5nwoDYfBd4QaLm6Sz9` in output script format for efficiency reasons. Example `112UhHtxuMMftNodp5nwoDYfBd4QaLm6Sz9` = `76a9141034fd8093641ae0741a0565fb7787bca1ac35fc88ac`


<a href='https://media.bitcoinfiles.org/block/000000000000000001cdfe7550e9f77bec9d10bc38e4a840f96db85eb64a787e/filter/31394878696756345179427633744870515663554551797131707a5a56646f417574'>Find all B:// files</a> Note: the bitcom prefix of `19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut` was converted to hex utf8: `31394878696756345179427633744870515663554551797131707a5a56646f417574`

 bitcoinfiles
            .scanner({ initHeight: 566492, saveUpdatedHeight: true })
            .filter({
                baseFilter: '31394878696756345179427633744870515663554551797131707a5a56646f417574',
                outputFilter: null,
                outputFilterId: null
            })
            .block(async (block, self) => {
                for (const e of block.tx) {
                    const tx = new bitcoin.Transaction(e.raw);
                    console.log(tx.hash);
                    fs.appendFileSync('b-files.txt', tx.hash);
                }
            })
            .error((err, self) => {
                console.log('error', err, self);
            })
            .start();

```shell
bitcoinfiles.scanner({
  initHeight: 632051,      // Start crawling at this height
  saveUpdatedHeight: true, // Save last height to file on disk
  onlyblocks: false,      // include mempool or not
})
.filter({
  baseFilter: null,
  outputFilter: ['1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf'],
  outputFilterId: null,
})
.mempool(function(e, self){
    const tx = new bsv.Transaction(e.raw);
    // Do something with the transaction...
})
.block((block, self) => {
  for (const e of block.tx) {
    const tx = new bsv.Transaction(e.raw);
    // Do something with the transaction...
  }
})
.error((err, self) => {
    console.log(err);
})
.start();

```

```javascript

bitcoinfiles.scanner({
   initHeight: 632051,      // Start crawling at this height
   saveUpdatedHeight: true, // Save last height to file on disk
   onlyblocks: false,      // include mempool or not
})
.filter({
  baseFilter: null,
  outputFilter: ['1Twetcht1cTUxpdDoX5HQRpoXeuupAdyf'],
  outputFilterId: null,
})
.mempool(function(e, self){
    const tx = new bsv.Transaction(e.raw);
    // Do something with the transaction...
})
.block((block, self) => {
  for (const e of block.tx) {
    const tx = new bsv.Transaction(e.raw);
    // Do something with the transaction...
  }
})
.error((err, self) => {
    console.log(err);
})
.start();

```



## Build and Test

```
npm run build
npm test
```

## Any questions?

We love to hear from you!
https://www.BitcoinFiles.org

https://www.matterpool.io


