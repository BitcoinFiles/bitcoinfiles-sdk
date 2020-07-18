"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const globalAny = global;
delete globalAny._bsv;
const bsv = require("bsv");
const bsvMessage = require("bsv/message");
const _ = require("lodash/core");
bsv.Message = bsvMessage;
const authorIdentityPrefix = '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva';
;
class Utils {
    static isHex(str) {
        return /^[0-9A-F]+$/i.test(str);
    }
    /**
     * Check whether the indexes are provided
     */
    static isIndexesProvided(indexes) {
        if (!indexes) {
            return false;
        }
        if (indexes && Array.isArray(indexes) && !indexes.length) {
            return false;
        }
        return true;
    }
    /**
     * Sign the arguments for the indexes provided, or sign them all.
     * This is not meant to be used directly if 0x6a is not the first payload.arg[0] value
     * @param payload
     */
    static signArguments(payload) {
        if (!payload) {
            throw new Error('insufficient data');
        }
        if (!Array.isArray(payload.args) || (Array.isArray(payload.args) && !payload.args.length)) {
            throw new Error('insufficient args');
        }
        const indexMap = {};
        let indexes;
        let argsToSign = payload.args;
        // Indexes are provided, therefore we take the clients input as what they want
        let isSignedAll = false; // Use this flag to determine whether to omit indexes or not
        if (Utils.isIndexesProvided(payload.indexes)) {
            indexes = payload.indexes;
        }
        else {
            // Indexes are not provided, therefore the client wants to sign 'everything' (and that includese the OP_RETURN 0x6a)
            // Generate indexes 0 to argsToSign.length
            indexes = [...Array(argsToSign.length).keys()];
            isSignedAll = true; // We will omit this indexes at the end for convenience
        }
        for (const index of indexes) {
            if (index > (argsToSign.length - 1)) {
                throw new Error('index out of bounds: ' + index);
            }
            if (index < 0) {
                throw new Error('index out of bounds negative: ' + index);
            }
            if (indexMap[index]) {
                throw new Error('duplicate index');
            }
            indexMap[index] = true;
        }
        const usedArgs = [];
        for (const index of indexes) {
            let selectedArg = argsToSign[index];
            if (_.isString(selectedArg)) {
                const checkHexPrefixRegex = /^0x(.*)/i;
                const match = checkHexPrefixRegex.exec(selectedArg);
                if (match) {
                    selectedArg = match[1];
                }
                if (selectedArg === '') {
                    selectedArg = '00';
                }
                if (!Utils.isHex(selectedArg)) {
                    // Force string to hex...
                    // throw new Error('string must be hex encoded');
                    selectedArg = Buffer.from(selectedArg).toString('hex');
                }
                selectedArg = Buffer.from(selectedArg, 'hex');
            }
            else if (Buffer.isBuffer(selectedArg)) {
                // Force adding a 0x00 into the data since that's how it will be encoded in OP_RETURN field
                if (selectedArg.length === 0) {
                    selectedArg = Buffer.from('00', 'hex');
                }
            }
            else {
                throw new Error('invalid argument type should be Buffer or a hex string: ' + selectedArg);
            }
            usedArgs.push(selectedArg);
        }
        if (!usedArgs || !usedArgs.length) {
            throw new Error('insufficient index args');
        }
        const bufferWriter = new bsv.encoding.BufferWriter();
        for (const field of usedArgs) {
            let bf = field;
            if (!Buffer.isBuffer(field)) {
                bf = new bsv.encoding.BufferReader(field);
                bf = bf.buf;
            }
            bufferWriter.write(bf);
        }
        const appData = bufferWriter.toBuffer();
        const signature = bsv.Message(appData).sign(bsv.PrivateKey(payload.key));
        const verified = bsv.Message(appData).verify(payload.address, signature);
        if (!verified) {
            throw new Error('signArguments - Signature verification failure: ' + signature);
        }
        return signature;
    }
    /**
     * Build author identity OP_RETURN fields
     * @param payload
     * @param include0x Whether to include '0x' in the outpout of each hex string or not
     */
    static buildAuthorIdentity(payload) {
        let payloadWithOpReturn = ['0x6a'].concat(payload.args);
        function toHex(d) {
            return ("0" + (Number(d).toString(16))).slice(-2).toLowerCase();
        }
        let indexes = payload.indexes;
        // Indexes are not provided, therefore make sure to add in the 'OP_RETURN' index that is not provided in the args
        let signAllImplicit = false;
        if (!Utils.isIndexesProvided(payload.indexes)) {
            indexes = [...Array(payloadWithOpReturn.length).keys()];
            signAllImplicit = true;
        }
        // const argsToSign: string[] = [];
        const hexIndexes = [];
        for (let count = 0; count < indexes.length; count++) {
            hexIndexes[count] = '0x' + toHex(indexes[count]);
            // argsToSign.push(payloadWithOpReturn[count]);
        }
        const signature = Utils.signArguments(Object.assign({}, payload, { args: payloadWithOpReturn, indexes }));
        const constructed = [
            '0x' + Buffer.from(authorIdentityPrefix).toString('hex'),
            '0x' + Buffer.from('BITCOIN_ECDSA').toString('hex'),
            '0x' + Buffer.from(payload.address).toString('hex'),
            '0x' + Buffer.from(signature, 'base64').toString('hex')
        ];
        // The 0'th index is the OP_RETURN itself (106)
        // But only add the indexes if the user provided them, otherwise we can omit them and assume everything is signed
        if (!signAllImplicit) {
            for (const index of indexes) {
                const indexStr = '0x' + toHex(index);
                constructed.push(indexStr);
            }
        }
        return constructed;
    }
    /**
     * Count the number of fields remaining in the OP_RETURN starting at startFieldIndex and then ending at either
     * when we find a '|' delimiter or reach end of array
     * @param args Arguments of OP_RETURN
     * @param startFieldIndex The first field to start counting from
     */
    static getCountOfFieldIndexesRemaining(args, startFieldIndex) {
        if (!args[startFieldIndex]) {
            return 0;
        }
        let fieldCount = 0;
        for (let i = startFieldIndex; i < args.length; i++) {
            if (/^(0x)?7c$/i.test(args[i])) {
                break;
            }
            fieldCount++;
        }
        return fieldCount;
    }
    /**
     * Validate that the AUTHOR IDENTITY at the given position is valid
     *
     * @param args Arguments of the OP_RETURN to validate
     * @param pos Position that the AUTHOR IDENTITY prefix is found
     */
    static validateAuthorIdentityOccurenceAtPos(args, pos) {
        if (!args[pos]) {
            return { valid: false };
        }
        // Enforce positions
        const algorithmSchemePos = 1;
        if (!args[pos + algorithmSchemePos] || Buffer.from(args[pos + algorithmSchemePos], 'hex').toString() !== 'BITCOIN_ECDSA') {
            return { valid: false, message: "invalid algorithm position" };
        }
        const addressPos = 2;
        if (!args[pos + addressPos]) {
            return { valid: false, message: "invalid address position" };
        }
        const address = Buffer.from(args[pos + addressPos], 'hex').toString();
        const signaturePos = 3;
        if (!args[pos + signaturePos]) {
            return { valid: false, message: "invalid signature position" };
        }
        const signature = Buffer.from(args[pos + signaturePos], 'hex').toString('base64');
        const firstFieldIndexPos = pos + signaturePos + 1;
        // Calculate how many field indexes there are remaining starting with the first argument after the signature
        const indexCount = Utils.getCountOfFieldIndexesRemaining(args, firstFieldIndexPos);
        let fieldIndexesForSignature = [];
        // If there are no indexes, then it is implied that everything to the left is signed
        if (indexCount > 0) {
            for (let indexIter = 0; indexIter < indexCount; indexIter++) {
                if ((firstFieldIndexPos + indexIter) < 0) {
                    return {
                        valid: false,
                        message: "field index less than 0"
                    };
                }
                if ((firstFieldIndexPos + indexIter) >= args.length) {
                    return { valid: false, message: "field index out of bounds greater than length" };
                }
                fieldIndexesForSignature.push(parseInt(args[firstFieldIndexPos + indexIter], 16));
            }
        }
        else {
            fieldIndexesForSignature = [...Array(pos).keys()];
        }
        const fieldsToSign = [];
        for (const index of fieldIndexesForSignature) {
            if (index < 0) {
                return { valid: false, message: "field index out of bounds < 0" };
            }
            if (index >= args.length) {
                return { valid: false, message: "field index out of bounds > length" };
            }
            fieldsToSign.push(args[index]);
        }
        const bufWriter = new bsv.encoding.BufferWriter();
        for (const fieldToSign of fieldsToSign) {
            let bf = Buffer.from(fieldToSign, 'hex');
            bufWriter.write(bf);
        }
        const appData = bufWriter.toBuffer();
        //try {
        const verified = bsv.Message(appData).verify(address, signature);
        if (verified) {
            return {
                valid: true,
                address: address,
                signature: signature,
                pos: pos,
                fieldIndexesForSignature: fieldIndexesForSignature
            };
        }
        // } catch (ex) {
        // Fail silently
        // todo: add debug/verbose mode in future
        // console.log('ex', ex);
        /// }
        return { valid: false, message: 'signature not match' };
    }
    /**
     * @param args Args of OP_RETURN (hex encoded with optional leading '0x')
     * @param expectedAuthorAddresses Single address or array addresses that are expected to sign in order
     */
    static verifyAuthorIdentity(args, expectedAuthorAddresses) {
        if (!expectedAuthorAddresses) {
            throw new Error('expectedAuthorAddresses required');
        }
        if (!Array.isArray(expectedAuthorAddresses)) {
            expectedAuthorAddresses = [expectedAuthorAddresses];
        }
        else if (!expectedAuthorAddresses.length) {
            throw new Error('expectedAuthorAddresses required');
        }
        const verificationResult = {
            verified: false,
            addresses: [],
            signedFullyByAddresses: [] // contains the addresses that fully signed everything to the left
        };
        for (const expectedAddress of expectedAuthorAddresses) {
            verificationResult.addresses.push({
                address: expectedAddress,
                verified: false
            });
        }
        let expectingSignatureIndex = 0;
        // Remove any '0x' prefix if present and add the 0x6a (OP_RETURN in by default)
        const cleanedArgs = ['6a'];
        for (const arg of args) {
            const checkHexPrefixRegex = /^0x(.*)/i;
            let currentFieldValue = arg;
            const match = checkHexPrefixRegex.exec(currentFieldValue);
            if (match) {
                currentFieldValue = match[1];
            }
            cleanedArgs.push(currentFieldValue);
        }
        for (let scanPrefixCounter = 0; scanPrefixCounter < cleanedArgs.length; scanPrefixCounter++) {
            const checkHexPrefixRegex = /^0x(.*)/i;
            let currentFieldValue = cleanedArgs[scanPrefixCounter];
            const match = checkHexPrefixRegex.exec(currentFieldValue);
            if (match) {
                currentFieldValue = match[1];
            }
            const decodedField = Buffer.from(currentFieldValue, 'hex');
            if (authorIdentityPrefix == decodedField) {
                const result = Utils.validateAuthorIdentityOccurenceAtPos(cleanedArgs, scanPrefixCounter);
                if (!result.valid) {
                    return Object.assign({}, verificationResult, { message: result.message });
                }
                if (verificationResult.addresses[expectingSignatureIndex] &&
                    result.address === verificationResult.addresses[expectingSignatureIndex].address) {
                    verificationResult.addresses[expectingSignatureIndex].verified = true;
                    verificationResult.addresses[expectingSignatureIndex].pos = result.pos;
                    verificationResult.addresses[expectingSignatureIndex].fieldIndexesForSignature = result.fieldIndexesForSignature;
                    if (verificationResult.signedFullyByAddresses &&
                        this.areAllFieldsIncludedUpto(result.fieldIndexesForSignature, result.pos)) {
                        verificationResult.signedFullyByAddresses.push(result.address);
                    }
                    expectingSignatureIndex++;
                }
                else {
                    return verificationResult;
                }
            }
        }
        let foundVerified = 0;
        for (const addressToVerify of verificationResult.addresses) {
            if (!addressToVerify.verified) {
                return verificationResult;
            }
            else {
                foundVerified++;
            }
        }
        verificationResult.verified = verificationResult.addresses.length === foundVerified;
        return verificationResult;
    }
    static areAllFieldsIncludedUpto(indexes, position) {
        if (!position) {
            return false;
        }
        if (!indexes || !Array.isArray(indexes)) {
            return false;
        }
        // Invalid if nothing signed or just OP_RETURN signed
        if (indexes.length <= 1) {
            return false;
        }
        // Build a map of all indexes that are signed
        const signedMap = {};
        for (const i of indexes) {
            signedMap[i] = true;
        }
        // Verify that all indexes are signed up until position
        for (let i = 0; i < position; i++) {
            if (!signedMap[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Detect and verify author identities by rawtx
     * @param rawtx Raw transaction to detect OP_RETURN with author identity in one of the outputs.
     */
    static detectAndVerifyAuthorIdentitiesByTx(rawtx) {
        let opReturnResults = {};
        if (!rawtx) {
            throw new Error('insufficient args');
        }
        const tx = new bsv.Transaction(rawtx);
        let rawHexArgs;
        rawHexArgs = [];
        let o = 0;
        for (const output of tx.outputs) {
            if (output.script.chunks.length <= 4) {
                continue;
            }
            let dataStartIndex;
            if (output.script.chunks[0].opcodenum !== 0 && output.script.chunks[0].opcodenum !== 106) {
                continue;
            }
            dataStartIndex = 2;
            for (let i = dataStartIndex; i < output.script.chunks.length; i++) {
                if (!output.script.chunks[i].buf) {
                    continue;
                }
                const k = '0x' + output.script.chunks[i].buf.toString('hex');
                rawHexArgs.push(k);
            }
            opReturnResults[o] = (Utils.detectAndVerifyAuthorIdentities(rawHexArgs, true));
            o++;
        }
        return opReturnResults;
    }
    /**
     * Detect and verify author identities
     * @param args Args of OP_RETURN (hex encoded with optional leading '0x')
     * @param safe whether to use safe OP_FALSE op return data
     */
    static detectAndVerifyAuthorIdentities(args, safe = false) {
        if (!args || !Array.isArray(args)) {
            throw new Error('insufficient args');
        }
        const detectedAddresses = [];
        // Remove any '0x' prefix if present
        const cleanedArgs = [];
        for (const arg of args) {
            const checkHexPrefixRegex = /^0x(.*)/i;
            let currentFieldValue = arg;
            const match = checkHexPrefixRegex.exec(currentFieldValue);
            if (match) {
                currentFieldValue = match[1];
            }
            cleanedArgs.push(currentFieldValue);
        }
        for (let scanPrefixCounter = 0; scanPrefixCounter < cleanedArgs.length; scanPrefixCounter++) {
            const checkHexPrefixRegex = /^0x(.*)/i;
            let currentFieldValue = cleanedArgs[scanPrefixCounter];
            const match = checkHexPrefixRegex.exec(currentFieldValue);
            if (match) {
                currentFieldValue = match[1];
            }
            const decodedField = Buffer.from(currentFieldValue, 'hex');
            if (authorIdentityPrefix == decodedField) {
                // There are not enough fields
                if (cleanedArgs.length - 1 < scanPrefixCounter + 2) {
                    throw new Error('insufficient fields');
                }
                detectedAddresses.push(Buffer.from(cleanedArgs[scanPrefixCounter + 2], 'hex').toString());
            }
        }
        if (!detectedAddresses.length) {
            return {
                verified: false,
                signedFullyByAddresses: [],
                addresses: []
            };
        }
        return this.verifyAuthorIdentity(args, detectedAddresses);
    }
}
exports.Utils = Utils;
