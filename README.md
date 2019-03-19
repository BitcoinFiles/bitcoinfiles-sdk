# bitcoinfiles-sdk
> BitcoinFiles Javascript SDK
https://www.BitcoinFiles.org

Easily create, retrieve and search for Bitcoin Data Protocol (`b://` files). Powered by Bitcoin SV.
Now supporting the ability to sign files with the [Author Identity Protocol](https://github.com/BitcoinFiles/AUTHOR_IDENTITY_PROTOCOL).

Protocol Docs:
- https://b.bitdb.network/
- https://github.com/unwriter/B
- https://github.com/BitcoinFiles/AUTHOR_IDENTITY_PROTOCOL

*Easily create files and store it on Bitcoin SV blockchain: *

```javascript
  require('bitcoinfiles-sdk').createFile({
    file: {
        content: 'hello world',
        contentType: 'text/plain',
    },
    pay: {
        key: "your wif key"
    }
  }, function(result) {
    console.log(result)
  });
  /*
  {
      success: true
      txid: "8657f139afbce31c038b852c8d6fb602b71f265d44421e357e02d602f0e4b8a3"
  }
  */

```

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

### Create File

*Create a plain text file*
```javascript
    /*
     Use with promises
    */
    const result = await bitcoinfiles.createFile({
      file: {
          content: 'hello world',
          contentType: 'text/plain',
      },
      pay: {
          key: "your wif key"
      }
    });

    console.log(result);

    /*
     Use with callback
    */
    require('bitcoinfiles-sdk').createFile({
      file: {
          content: 'hello world',
          contentType: 'text/plain',
      },
      pay: {
          key: "your wif key"
      }
    }, function(result) {
          console.log(result)
    });
    /*
    {
        success: true
        txid: "8657f139afbce31c038b852c8d6fb602b71f265d44421e357e02d602f0e4b8a3"
    }
    */

```

### Create File (Full options)

*Create a json file with additional options*
You can specify up to 3 optional tags. If tags are specified then the file name is mandatory or an empty filename will be inserted.

Please note: By default the *encoding* is UTF-8 and if anything other is provided, then it is assumed to be binary data and it is your responsibility to hex-encode the `content` parameter with your binary data.

```javascript
    var result = await bitcoinfiles.createFile({
      file: {
          content: JSON.stringify({ hello: "world", "someValue": 123}),
          contentType: 'application/json',
          encoding: 'utf-8',
          name: 'myfile.json',
          tags: ['coding', 'https://www.bitcoinfiles.org/schema/1', 'another tag']
      },
      pay: {
          key: "your wif key"
      },
      /*
      // Optional to sign the content with another set of private keys
      signatures: [
        {
          key: "your wif key"
        }
      ]
      */
    });
    console.log(result);
    /*
    {
        success: true
        txid: "8657f139afbce31c038b852c8d6fb602b71f265d44421e357e02d602f0e4b8a3"
    }
    */
```

### Get File by Txid

```javascript
  const result = await bitcoinfiles.get('0e3bd6077c1da1e564c36dd18c71d4d45c00369cd1badcfa303a88b867809c99');

  console.log(result)
  /*
  {
      success: true,
      data: [
          {
              txid: '0e3bd6077c1da1e564c36dd18c71d4d45c00369cd1badcfa303a88b867809c99',
              url: 'https://media.bitcoinfiles.org/0e3bd6077c1da1e564c36dd18c71d4d45c00369cd1badcfa303a88b867809c99'
          }
      ]
  }
  */

  // With a callback
  bitcoinfiles.get('0e3bd6077c1da1e564c36dd18c71d4d45c00369cd1badcfa303a88b867809c99', function(result) {
      console.log(result)
  });

```

### Resolve Bitcoin Files (b://) links to hosting provider

Note: defaults to https://media.bitcoinfiles.org hosting domain, but it can be configured to return any hosting domain.

```javascript
  const url = bitcoinfiles.getFileUrl('b://0e3bd6077c1da1e564c36dd18c71d4d45c00369cd1badcfa303a88b867809c99');

  console.log(url)
  // https://media.bitcoinfiles.org/0e3bd6077c1da1e564c36dd18c71d4d45c00369cd1badcfa303a88b867809c99'

```

### Search Files

*Find the latest file created by address 1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz that also contains the first tag of 'tag1'*

```javascript
  var result = await index.find({
      address: "1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
      tags: [
          'tag1',
      ]
  });
  console.log(result);
  /*
  {
      success: true,
      data: [
          {
              txid: '821a1cf59160b08a5e2805c33d19381a0124ea8291808ad23e306b4f9e7782bd',
              url: 'https://media.bitcoinfiles.org/821a1cf59160b08a5e2805c33d19381a0124ea8291808ad23e306b4f9e7782bd'
          }
      ]
  }
  */

  // With a callback
  bitcoinfiles.find({
      address: "1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
      tags: [
          'tag1',
      ]
  }, function(result) {
      console.log(result);
  });

```


*Find the most recent 5 files (application/json), but skipping the very first file for the address 1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz*

```javascript
  var result = await index.find({
      address: "1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
      contentType: "application/json",
      // Optional filters and sorting:
      limit: 5,
      skip: 1,
      sort: -1,
      // Default 'blk.i'
      // sortField: 'blk.i' // Any Planaria field identifier such as out.s1, out.h1, etc are available
  });
  console.log(result);
  /*
  {
      success: true,
      data: [
              {
                  txid: '821a1cf59160b08a5e2805c33d19381a0124ea8291808ad23e306b4f9e7782bd',
                  url: 'https://media.bitcoinfiles.org/821a1cf59160b08a5e2805c33d19381a0124ea8291808ad23e306b4f9e7782bd'
              },
              {
                  "txid": "05ad1708371a03e17688859211e6460c10a87bfc01127ae9d33dd0c93f3db444",
                  "url": "https://media.bitcoinfiles.org/05ad1708371a03e17688859211e6460c10a87bfc01127ae9d33dd0c93f3db444"
              },
              {
                  "txid": "e1ac85aaec68947b41270ba3f1ef68e7782533855eb102e561fde3b0181fac57",
                  "url": "https://media.bitcoinfiles.org/e1ac85aaec68947b41270ba3f1ef68e7782533855eb102e561fde3b0181fac57"
              },
              {
                  "txid": "8657f139afbce31c038b852c8d6fb602b71f265d44421e357e02d602f0e4b8a3",
                  "url": "https://media.bitcoinfiles.org/8657f139afbce31c038b852c8d6fb602b71f265d44421e357e02d602f0e4b8a3"
              }
          ]
  }
  */

  // With a callback
  bitcoinfiles.find({
      address: "1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
      contentType: "application/json",
      limit: 5,
      skip: 1,
      sort: -1
  }, function(result) {
      console.log(result);
  });

```

*Find the most recent file named 'hello.txt' created by 1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz*

```javascript
  var result = await bitcoinfiles.find({
      address: "1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
      name: "hello.txt",
      skip: 1,
      sort: -1
  });
  console.log(result);
  /*
  {
      success: true,
      data: [
              {
                  txid: '821a1cf59160b08a5e2805c33d19381a0124ea8291808ad23e306b4f9e7782bd',
                  url: 'https://media.bitcoinfiles.org/821a1cf59160b08a5e2805c33d19381a0124ea8291808ad23e306b4f9e7782bd'
              }
          ]
  }
  */

```

*Find most recent file updates that has MAP keys and values of files named 'hello.txt' sorted by the out.s8 field in Planaria bitdb*

```javascript
  var result = await bitcoinfiles.find({
      name: "hello.txt",
      sort: -1,
      sortField: 'out.s8'
  });
  console.log(result);
  /*
  {
      success: true,
      data: [
              {
                  txid: '...',
                  url: '...'
              }
          ]
  }
  */

```

### Sign and Create File

*Create a plain text file and attach a Bitcoin ECDSA signature using the Author Identity Protocol*

- https://github.com/BitcoinFiles/AUTHOR_IDENTITY_PROTOCOL

```javascript
    /*
     Use with promises
    */
    const result = await bitcoinfiles.createFile({
      file: {
          content: 'hello world',
          contentType: 'text/plain',
      },
      pay: {
          key: "your wif key"
      },
      signatures: [
        {
          key: "your wif key for signing"
        }
      ]
    });

    console.log(result);

    /*
    {
        success: true
        txid: "tx hash..."
    }
    */

```

### Sign and Build File

*Build a application/json file and attach a Bitcoin ECDSA signature using the Author Identity Protocol*

- https://github.com/BitcoinFiles/AUTHOR_IDENTITY_PROTOCOL

```javascript
    /*
     Use with promises
    */
    const result = await bitcoinfiles.buildFile({
        file: {
            content: '{ "message": "Hello world!" }',
            contentType: 'application/json',
        },
        pay: {
            key: privateKey
        },
        signatures: [
            {
                key: privateKey
            }
        ]
    });

    console.log(result);
    /*
    // Shows the status and 'data' contains the array of the file and signature content
    {
        success: true
        data: [
            '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
            '0x7b20226d657373616765223a202248656c6c6f20776f726c6421227d',
            '0x6170706c69636174696f6e2f6a736f6e',
            '0x7574662d38',
            '0x00',
            '0x7c',
            '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
            '0x424954434f494e5f4543445341',
            '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
            '0x1b3ffcb62a3bce00c9b4d2d66196d123803e31fa88d0a276c125f3d2524858f4d16bf05479fb1f988b852fe407f39e680a1d6d954afa0051cc34b9d444ee6cb0af',
            '0x06',
            '0x06',
            '0x00',
            '0x01',
            '0x02',
            '0x03',
            '0x04',
            '0x05'
        ];
    }
    */
```
Now you can verify the signature on the OP_RETURN data (optional):

```javascript
var verifySigResult = await bitcoinfiles.verifyAuthorIdentity(result.data, ['1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz']);
console.log(verifySigResult);

/*
    {
        verified: true,
        addresses: [
            {
                address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                ],
                pos: 6
            }
        ]
    }
*/
```

It can be broadcast via datapay or using the `bitcoinfiles.datapay` wrapper:

```javascript
    // Now create the file from the constructed array using the datapay wrapper
    var result = await bitcoinfiles.datapay({
        data: result.data,  // returned from bitcoinfiles.buildFile(...)
        pay: {
            key: 'your wif key'
        }
    });
    console.log(result);
    /*
    {
        success: true,
        txid: 'tx hash...'
    }
    */
```

### Verify Author Identity

*Verify the Author Identity of an array of OP_RETURN fields*

Note: You must provide the addresses that you expect the OP_RETURN to be signed by.
If you want to auto-detect then use `detectAndVerifyAuthorIdentity` below.

```javascript
var opReturnFields = [
    '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
    '0x7b20226d657373616765223a202248656c6c6f20776f726c6421227d',
    '0x6170706c69636174696f6e2f6a736f6e',
    '0x7574662d38',
    '0x00',
    '0x7c',
    '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
    '0x424954434f494e5f4543445341',
    '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
    '0x1b3ffcb62a3bce00c9b4d2d66196d123803e31fa88d0a276c125f3d2524858f4d16bf05479fb1f988b852fe407f39e680a1d6d954afa0051cc34b9d444ee6cb0af',
    '0x06',
    '0x06',
    '0x00',
    '0x01',
    '0x02',
    '0x03',
    '0x04',
    '0x05'
];
var verifySigResult = await bitcoinfiles.verifyAuthorIdentity(opReturnFields, ['1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz']);
console.log(verifySigResult);

/*
    {
        verified: true,
        addresses: [
            {
                address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                ],
                pos: 6
            }
        ]
    }
*/
```


### Detect and Verify Author Identities

*Detects and Verifies the Author Identities of an array of OP_RETURN fields*

Note: Use this method when you do not know what the addresses that signed the data are.

Special care must be taken to ensure that addresses you expect are present *and* that the `fieldIndexesForSignature`
covers the relevant OP_RETURN fields that you care about.  If you do not check the fields that are signed then
someone can sign a single field or re-use an old signature by the Identity and attempt to pass off a forgey.

Therefore you must always check that the addresses are what you expect along with the field indexes that are important to establish the Identity and complete signing.


```javascript
var opReturnFields = [
    '0x31394878696756345179427633744870515663554551797131707a5a56646f417574',
    '0x48656c6c6f20776f726c6421',
    '0x746578742f706c61696e',
    '0x7574662d38',
    '0x00',
    '0x7c',
    '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
    '0x424954434f494e5f4543445341',
    '0x31455868536247466945415a4345356565427655785436634256486872705057587a',
    '0x1c97ffc1a7231bd671df54bd1fa171bd764f22905adc3465753665b5f28e36b1f30a82503984d32175e6aca75fbc53a7f81b4bcd20c074984f5f071eb529fad2a3',
    '0x06',
    '0x06',
    '0x00',
    '0x01',
    '0x02',
    '0x03',
    '0x04',
    '0x05',
    '0x7c',
    '0x313550636948473232534e4c514a584d6f5355615756693757537163376843667661',
    '0x424954434f494e5f4543445341',
    '0x31396e6b6e4c68526e474b525233686f6265467575716d48554d694e544b5a487352',
    '0x1b88faf24d32af9d50e200351bc808d6b01f3653b15a1f99cf9652704f95e7653a463ec95771b888e9878cc6425eafe4ef0e42c3b9f0b9572da6ab5af28a701974',
    '0x13',
    '0x13',
    '0x00',
    '0x01',
    '0x02',
    '0x03',
    '0x04',
    '0x05',
    '0x06',
    '0x07',
    '0x08',
    '0x09',
    '0x0a',
    '0x0b',
    '0x0c',
    '0x0d',
    '0x0e',
    '0x0f',
    '0x10',
    '0x11',
    '0x12'
];
var result = await bitcoinfiles.detectAndVerifyAuthorIdentities(opReturnFields);
console.log(result);

/*
    {
        verified: true,
        addresses: [
            {
                address: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                ],
                pos: 6
            },
            {
                address: '19nknLhRnGKRR3hobeFuuqmHUMiNTKZHsR',
                verified: true,
                fieldIndexesForSignature: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18
                ],
                pos: 19
            }
        ]
    }
*/
```


## Build and Test

```
npm run build
npm test
```

-----------


 ## Any questions?

 We love to hear from you!
 https://www.BitcoinFiles.org
 https://twitter.com/BitcoinFiles


