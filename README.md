# bitcoinfiles-sdk
> BitcoinFiles Javascript SDK
https://www.BitcoinFiles.org

Easily create, retrieve and search for Bitcoin Data Protocol (`b://` files).  Powered by Bitcoin SV.

Protocol Docs:
- https://b.bitdb.network/
- https://github.com/unwriter/B

**Easily create files in Bitcoin SV:**

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
yarn add bitcoinfiles-sdk
bower install bitcoinfiles-sdk --save
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
      }
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
      limit: 5,
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

## Build  and Test

```
npm run build
npm test
```


-----------


 ## Any questions?

 We love to hear from you!
 https://www.BitcoinFiles.org
 https://twitter.com/BitcoinFiles


