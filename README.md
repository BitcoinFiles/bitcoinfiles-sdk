# bitcoinasset:// Protocol
v1.0
> Create and manage (non-fungible) digital assets on the Bitcoin blockchain.

- Bitcom Prefix: `1CLcHRfBvtMVB2VNFjNXq7VfamY9FXfw7K`
- Protocol Spec: https://github.com/bitcoin-asset/bitcoinassetjs

NOTE: This is beta and we need your help to define the spec for 'Ownership Transfers'.

## Use Cases

##### Art and Content Ownership
Create unique art, ebooks, media and more.  Be able to transfer ownership of limited edition items to other users.

##### Digital Titles
Create any kind of item that benefits from ownership. You can build Crypto Kitties or any other kind of digital property. The only limitation is your imagination.

## Design Goals
1. A simple and flexible way to create, update, and transfer (non-fungible) digital assets on the blockchain.
2. Use web existing standards, including the Bitcoin Data Protocol (`b://`), to maximize compatibility.
3. Efficient state and ownership resolution: The time to resolve the current owner should be done in <= O(n) operations, where n is the total number of ownership transfers of the asset during it's lifespan. The time to resolve the current state of the asset should be no more than O(1) lookups

## Installation and Usage

**Installation**
```sh
npm install bitcoinassetjs --save
yarn add bitcoinassetjs
bower install bitcoinassetjs --save
```

**Include**
```javascript
// Include the library
var bitcoinassetjs = require('bitcoinassetjs');
```

## API Endpoints and Form Asset Builder

**Query UTXOs and Wallet Balances with the [BitIndex API](https://www.bitindex.network)**


**Create Bitcoin Asset at [BitcoinFiles.org/new-asset](https://www.bitcoinFiles.org/new-asset)**

**Retrieve Bitcoin Asset with the [BitcoinFiles API](https://www.bitcoinFiles.org)**
*Example:*
[https://media.bitcoinfiles.org/3b38864d0d21fb547376da5d4e77410ce8350dc51658fd2f2a36655796ca96df](https://media.bitcoinfiles.org/3b38864d0d21fb547376da5d4e77410ce8350dc51658fd2f2a36655796ca96df)

Sample response (Note the content-type of `application/bitcoinasset+json`)
```
{
   "success":true,
   "data":{
      "assetImmutableData":{

      },
      "assetDataOriginal":{
         "dataUrl":"b://cc34ca3b413f6a6ac265d04ecc02061eb036b27009ac4866371795e8448299d7",
         "dataSchemaUrl":"b://cda5892c061afb50f09d99baa6fef40cae660cf87637faedb12ebdc52adfa167",
         "dataSchemaType":"http://json-schema.org/draft-07/schema#"
      },
      "assetDataCurrent":{
         "dataUrl":"b://27ffb6f4c23a54179e07b795c5441316e7b70ece416975a5aeb6af510b634c63",
         "dataSchemaUrl":"b://cda5892c061afb50f09d99baa6fef40cae660cf87637faedb12ebdc52adfa167",
         "dataSchemaType":"http://json-schema.org/draft-07/schema#",
         "metadataUrl":"\u0000",
         "metadataSchemaUrl":"\u0000",
         "metadataSchemaType":"\u0000"
      },
      "blockInfoOriginal":{
         "createdTime":1551154986,
         "blockHeight":571299,
         "txid":"3b38864d0d21fb547376da5d4e77410ce8350dc51658fd2f2a36655796ca96df"
      },
      "blockInfoCurrent":{
         "createdTime":null,
         "blockHeight":null,
         "txid":"3fd203ec4a3c0644d477a68777c1c198d7d29f49b5f8eca0d4a4a9c3d8c1718f"
      },
      "assetOwnership":{
         "originalOwnerAddress":"1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
         "currentOwnerAddress":"1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
         "ownershipHistoryRecords":[

         ]
      },
      "updateAddress":"1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
      "txid":"3b38864d0d21fb547376da5d4e77410ce8350dc51658fd2f2a36655796ca96df"
   }
}

```



##### Create Asset:

_Simple Example_

Create minimal viable asset.

```javascript
bitcoinassetjs.getClient().create({
    asset: {
        dataUrl: 'b://3150276948348c428d2f86596953d503a4e8508b2238201a3b7e281b180d7c4c',
        updateAddress: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz'
    },
    pay: {
        key: 'your private key'
    }
});
```

_Advanced Example_

Use JSON schema to define the type of data and how to validate it.

```javascript
bitcoinassetjs.getClient().create({
    asset: {
        dataUrl: 'b://3150276948348c428d2f86596953d503a4e8508b2238201a3b7e281b180d7c4c',
        dataSchemaType: 'http://json-schema.org/draft-07/schema#',
        dataSchemaUrl: 'b://3150276948348c428d2f86596953d503a4e8508b2238201a3b7e281b180d7c4c#some-namespace/schema/some-object-type/draft-01',
        updateAddress: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz'
    },
    pay: {
        key: 'your private key'
    }
});
```

#### Find Asset

```javascript
// First find and retrieve the asset and validate with JSON Schema (2nd argument = true)
var found = await bitcoinassetjs.getClient().find('4b541e091d6af2f60d256dfca2685f95bf2d3a9b7995595115183d37b7c5bf90', true);
console.log(found);
/*
{
  success: true,
  data: {
    "txid": "4b541e091d6af2f60d256dfca2685f95bf2d3a9b7995595115183d37b7c5bf90",
    "assetDataCurrent": {
        dataUrl: 'b://9a201f03464ef345ae7d8fd49bdf09eddc52a96345358438af4f13af7f4b56fa',
        dataSchemaUrl: 'b://d3df63599f8e1d02d98f263f1a0427de01c95f077758c58f2d7a6bd94ea6da70',
        dataSchemaType: 'http://json-schema.org/draft-07/schema#',
        "metadataSchemaUrl": undefined,
        "metadataSchemaType": undefined,
        "metadataUrl": undefined,
    },
    "assetDataOriginal": {
        dataUrl: 'b://9a201f03464ef345ae7d8fd49bdf09eddc52a96345358438af4f13af7f4b56fa',
        dataSchemaUrl: 'b://d3df63599f8e1d02d98f263f1a0427de01c95f077758c58f2d7a6bd94ea6da70',
        dataSchemaType: 'http://json-schema.org/draft-07/schema#',
        "metadataSchemaUrl": undefined,
        "metadataSchemaType": undefined,
        "metadataUrl": undefined,
    },
    "blockInfoCurrent": {
        "blockHeight": 570305,
        "createdTime": 1550546281,
        "txid": "4b541e091d6af2f60d256dfca2685f95bf2d3a9b7995595115183d37b7c5bf90",
    },
    "blockInfoOriginal": {
        "blockHeight": 570305,
        "createdTime": 1550546281,
        "txid": "4b541e091d6af2f60d256dfca2685f95bf2d3a9b7995595115183d37b7c5bf90",
    },
    "assetImmutableData": {
        "immutableSchemaUrl": undefined,
        "immutableSchemaType": undefined,
        "immutableUrl": undefined
    },
    "updateAddress": "1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
    "assetOwnership": {
        originalOwnerAddress: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
        currentOwnerAddress: '1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz',
        ownershipHistoryRecords: []
    }
  }
});
*/

```

##### Update Asset

All the data* and metadata* fields can be updated in the asset by signing a request with the *privateKey* of the `updateAddress`.

The immutable* fields are forever unchangeable.

```javascript

// BEWARE: All the fields that are null/undefined or not present will OVERWRITE original asset
// See below on how to ensure you always have the latest version and do not inadvertantly overwrite the fields you want to keep.
const result = await bitcoinassetjs.getClient().update({
  txid: '172908fd19df177356e369867623bb1f9d90b8d1d55c384ebd468985d7da035e',
  update: {
    dataUrl: 'b://3150276948348c428d2f86596953d503a4e8508b2238201a3b7e281b180d7c4c',
    dataSchemaType: 'http://json-schema.org/draft-07/schema#',
    dataSchemaUrl: 'b://3150276948348c428d2f86596953d503a4e8508b2238201a3b7e281b180d7c4c#some-namespace/schema/some-object-type/draft-01',
    metadataUrl: undefined,
    metadataSchemaUrl: undefined,
    metadataSchemaType: undefined,
  },
  pay: {
    key: 'your private key'
  }
});
```

Updating 1 field, but keeping the existing fields, First retrieve the latest version, and then perform the update.

```javascript

// First find and retrieve the asset
var found = await bitcoinassetjs.getClient().find('172908fd19df177356e369867623bb1f9d90b8d1d55c384ebd468985d7da035e');
// now update the specific field you want, using Object.assign to keep the existing fields
var update = await bitcoinassetjs.getClient().update({
    txid: found.data.txid,
    update: Object.assign({}, found.data.assetDataCurrent,
      {
          metadataSchemaUrl: 'b://updated-metadataSchemaUrl'
      }
    ),
    pay: {
      key: 'your private key'
    }
});

```

## Build  and Test

```
npm run build
npm test
```


-----------


## Technical Trade-offs

##### Use OP_RETURN versus Script
The benefit of using OP_RETURN conventions to define ownership is that it is not easy to accidentally "spend" an asset. UTXO based assets can be accidentally spent by wallets that are "unaware" that an asset exists and users can lose control of their assets.

On the other hand it is extremely easy to enumerate all owned assets by an address by checking the UTXO set.

The disadvantage OP_RETURN is that it is more difficult for services to know what are all the assets a given address owns a given point in time. We describe some methods below to be able to list all currently owned assets by an address below (bitdb queries).

A design goal of this protocol is to be simple to implement and compatible with `b://`, therefore we opted for an OP_RETURN based solution for *Bitcoin Simple Asset Protocol 1.0*.

##### Update asset data frequently, but transfer ownership occasionally
It is expected that asset data will be updated very frequently, but ownership will be transferred infrequently.

This protocol optimizes for resolving the current owner quickly and then performing a simple query to retrieve the latest version of the asset data.

The reason for this is that most of the time we only care about *who is the current owner* and what is the *current state of the asset*.

##### Prefer full ownership validation
To make the protocol simple and easy to implement, the rule is that all implementors must always validate the full ownership chain of an asset starting from the txid of the asset and following the CREATE transaction through all TRANSFER commands.

## Protocol Messages

### Overview
##### Create Asset
Define the initial data and metadata of the asset.

input1: Asset Creator
output1: OP_RETURN
```
OP_RETURN
  1CLcHRfBvtMVB2VNFjNXq7VfamY9FXfw7K
  <Action = 0>
  <Update Address>
  <Asset Data URL>
  [Asset Data Schema URL]
  [Asset Data Schema Type]
  [Asset Metadata URL]
  [Asset Metadata Schema URL]
  [Asset Metadata Schema Type]
  [Asset Immutable Data URL]
  [Asset Immutable Schema URL]
  [Asset Immutable Schema Type]
  [Tag 1]
  [Tag 2]
  [Tag 3]
  [Tag 4]
  [Tag 5]
```

#### Get the current state of an asset

First resolve the current owner, and saving all of the Update Delegate Address along the way into an array.

Starting with the most recent Update Delegate Address, query for an *Update* OP_RETURN and take the most recent transaction (highest block height) then use that as the current data.

If no transaction found for current owner, then use the previous owner's update delegate and repeat the process until an Update is found.  If not updates are found, then the *Create* data is the current data.

 Run-time: O(3 * N * k) = O(N)
 Where
 N = total number of owners
 k = Number of transactions each owner did with same owner address

It is recommended that a new owner perform an immediate *Update* operation to easy the burden of resolving the current state for all viewers of the data.

##### Update Asset
Update the data or metadata of the asset

```
OP_RETURN
  1CLcHRfBvtMVB2VNFjNXq7VfamY9FXfw7K
  <Action = 1>
  <Txid of asset CREATE tx>
  <Asset Data URL>
  [Asset Data Schema URL]
  [Asset Data Schema Type]
  [Asset Metadata URL]
  [Asset Metadata Schema URL]
  [Asset Metadata Schema Type]
  [Tag 1]
  [Tag 2]
  [Tag 3]
  [Tag 4]
  [Tag 5]
```

**Protocol Identifier: 1CLcHRfBvtMVB2VNFjNXq7VfamY9FXfw7K**
Fixed unique identifier to indicate that this transaction is a *Bitcoin Simple Asset* transaction.

**<Action>**
Required. Set to `0` for the CREATE action.
Specifies whether this is a CREATE, UPDATE, or TRANSFER action.
```
enum ActionType {
    CREATE = 0,
    UPDATE = 1,
    TRANSFER = 2
}
```

**<Update Address>**
Required.
The address that is allowed to update the asset

**<Data URL>**
Required.
URL of initial state data. Can be any valid URL or Data-URL. It is recommended that a Data-URL is used or `b://` URL so that all initial state is stored on the blockchain.

**[Data Schema URL]**
Optional, but recommended.

URL to a file that describes the types and meaning of the data.

This can be a human-readable document that describes how to interpret the data located at <Data URL> or it can be a URL to a XML-Schema, JSON-Schema, or any other validation scheme that will validate the <Data URL>  contents.

It is recommended that a Data-URL is used or `b://` URL so that the Data Description for the initial state data is stored on the blockchain.

**[Data Schema Type]**
Optional, but recommended.

Specifies the type of validation to perform on the data at the [Data URL] according to the rules in [Data Description URL]

To use JSON-Schema, set <Data URL> to point to a file with content-type `application/json` and <Data Schema Type> to `http://json-schema.org/schema#`

To use XML-Schema, set <Data URL> to point to a file with content-type `application/xml` and <Data Schema Type> to `http://www.w3.org/2001/XMLSchema`.

Any type of programmatic or human readable validation can be used.  If a human-readable text description is desired, then the <Data Description Validation Scheme> can be omitted and then rely on humans interpretting the content at [Data Description URL]

### Get current asset data

First resolve the current owner.

Then perform a query to fetch the most recent *UPDATE* action created by the current owner.

Todo:  How do we get the correct recent state even if the owner of the asset has exchanged hands back and forth with the same address? Note: Using the above logic, we will get stale state if some other intermediate owner changed the state

# Future / Next Steps

#### How to do Atomic Swap of 2 assets?
TODO

#### How can one asset "own" another asset?
TODO

#### How to transfer ownership

- Allow atomic swaps between 2 or more bitcoin assets
- Make it safe and secure for buyer and seller to send money to pay for an asset and have it atomically transact (or not go through at all)

