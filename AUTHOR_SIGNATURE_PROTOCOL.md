# Author Signature Protocol
> A simple and flexible method to sign arbitrary OP_RETURN data with Bitcoin ECDSA signatures.

# Intro

The design goals:

1. A simple protocol to sign arbitrary OP_RETURN data in a single transaction
2. Decouple the signing with an address from the funding source address (ie: does not require any on-chain transactions from the signing identity address)
3. Allow multiple signatures to be layered on top to provide multi-party contracts.

# Protocol

- The prefix for AUTHOR SIGNATURE Protocol is `15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva`

Here's an example of what **POST transactions** look like:

```
OP_RETURN
  19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut
  [Data]
  [Media Type]
  [Encoding]
  [Filename]
  |
  15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva
  [Signing Algorithm]
  [Signing Address]
  [Signature]
  [Field Offset]
  [Field Count]
  [Field Index 0]
  [Field Index 1]
  ...
  [Field Index (Field Count - 1)]
```

An example with signing [B:// Bitcoin Data](https://github.com/unwriter/B]) is shown, however any arbitrary OP_RETURN content can be signed provided that the fields being signed are before the AUTHOR SIGNATURE `15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva` prefix.

We use the Bitcom convention to use the pipe '|' to indicate the protocol boundary.

Fields:

1. **Signing Algorithm:** ECDSA - This is the default Bitcoin signing algorithm built into bsv.js. UTF-8 encoding.
2. **Signing Address:** Bitcoin Address that is used to sign the content. UTF-8 encoding.
3. **Signature:** The signature of the signed content with the Signing Address. Base64 encoding.
4. **Field Offset:** An offset used indicate which field position to start looking for fields in the OP_RETURN. This offset is _negative_ relative to the AUTHOR SIGNATURE prefix. Positive integer hex encoding.
5. **Field Count:** The total number of fields being signed. The specific field indexes being signed (relative to Field Offset) are listed next. Positive integer hex encoding.
6. **Field Index <index>:** The specific index (relative to Field Offset) that is covered by the Signature.  Non-negative integer hex encoding.

Example:

```
OP_RETURN
  19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut  // B Prefix
  { "message": "Hello world!" }       // Content
  applciation/json                    // Content Type
  UTF-8                               // Encoding
  0x00                                // File name (empty in this case with 0x00 to indicate null)
  |                                   // Pipe to seperate protocols
  15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva, // AUTHOR SIGNATURE prefix
  BITCOIN_ECDSA                       // Signing Algorithm
  1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz, // Signing Address
  0x1b3ffcb62a3bce00c9b4d2d66196d123803e31fa88d0a276c125f3d2524858f4d16bf05479fb1f988b852fe407f39e680a1d6d954afa0051cc34b9d444ee6cb0af, // Signature
  6 // Negative offset from the left of the AUTHOR SIGNATURE prefix
  6 // Field Count that follows (in this example we are signing everything before the AUTHOR SIGNATURE prefix
  0 // OP_RETURN index (-6 + 0) = -6 (relative to AUTHOR SIGNATURE prefix)
  1 // OP_RETURN index (-6 + 1) = -5 (relative to AUTHOR SIGNATURE prefix)
  2 // OP_RETURN index (-6 + 2) = -4 (relative to AUTHOR SIGNATURE prefix)
  3 // OP_RETURN index (-6 + 3) = -3 (relative to AUTHOR SIGNATURE prefix)
  4 // OP_RETURN index (-6 + 4) = -2 (relative to AUTHOR SIGNATURE prefix)
  5 // OP_RETURN index (-6 + 5) = -1 (relative to AUTHOR SIGNATURE prefix)
];

```

In Hex form:
```

OP_RETURN
[
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
]


```

<br>

# Note


<br>

# Demo

todo...


# Usage

## 1. Signing a Bitcoin Data File

Let's upload an image.

You can try it [here](https://b.bitdb.network) (up to 100KB)

When you select a file, it **directly writes the binary (ArrayBuffer)** into Bitcoin pushdata (instead of base64 string). The resulting OP_RETURN would look something like this:

```
OP_RETURN 19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut [ArrayBuffer from the file]  image/png  binary  duck.png
```

By default, the encoding is `binary`, so you could just do (if you don't care about file names):

```
OP_RETURN 19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut [ArrayBuffer from the file]  image/png
```

Another example:

```
OP_RETURN 19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut [ArrayBuffer from the file]  text/html  UTF-8  index.html
```

## 2. Signing and Counter-Signing a Bitcoin Data File (2 or more signatures)

Let's upload an image.

You can try it [here](https://b.bitdb.network) (up to 100KB)

When you select a file, it **directly writes the binary (ArrayBuffer)** into Bitcoin pushdata (instead of base64 string). The resulting OP_RETURN would look something like this:

```
OP_RETURN 19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut [ArrayBuffer from the file]  image/png  binary  duck.png
```

By default, the encoding is `binary`, so you could just do (if you don't care about file names):

```
OP_RETURN 19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut [ArrayBuffer from the file]  image/png
```

Another example:

```
OP_RETURN 19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut [ArrayBuffer from the file]  text/html  UTF-8  index.html
```

<br>

## 2. Signing Arbitrary OP_RETURN

Once uploaded, this media can be referenced from ANY other transactions using a transaction hash. For example, let's say the media hash for an image uploaded this way was `46e1ca555622e73708a065f92df0af2cc0fe00ed1dd352d5fb8510365050347c`.

You can reference it in another HTML file like this:

```
<html>
<body>
<img src="b://46e1ca555622e73708a065f92df0af2cc0fe00ed1dd352d5fb8510365050347c">
</body>
</html>
```

Of course, to upload this HTML file itself, you would do this:

```
OP_RETURN
19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut
<html><body><img src="b://46e1ca555622e73708a065f92df0af2cc0fe00ed1dd352d5fb8510365050347c"></body></html>
text/html
UTF-8
example.html
```

Once this HTML file is uploaded to Bitcoin, and the tx hash is `e2be88f33d98074f778ddd94c13fe500cb1f5a4dfb3ed958391c95f431c20549`, you can link it from another HTML, like this:


```
<html>
<body>
Check out <a href="b://e2be88f33d98074f778ddd94c13fe500cb1f5a4dfb3ed958391c95f431c20549">my website!</a>
</body>
</html>
```

You can use it in a markdown too:

```
[Here](b://e2be88f33d98074f778ddd94c13fe500cb1f5a4dfb3ed958391c95f431c20549) is a website, which contains the following image:

![image](b://46e1ca555622e73708a065f92df0af2cc0fe00ed1dd352d5fb8510365050347c)
```

Of course, you will upload it like this:

```
OP_RETURN
19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut
[Here](b://e2be88f33d98074f778ddd94c13fe500cb1f5a4dfb3ed958391c95f431c20549) is a website, which contains the following image:\n![image](b://46e1ca555622e73708a065f92df0af2cc0fe00ed1dd352d5fb8510365050347c)
text/markdown
UTF-8
README.md
```
