import * as bsv from 'bsv';
import * as bsvMessage from 'bsv/message';
import * as _ from 'lodash/core';
bsv.Message = bsvMessage;

declare var Buffer;
const authorIdentityPrefix = '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva';

export class Utils {
    static isHex(str: string): boolean{
        return /^[0-9A-F]+$/i.test(str);
    }

    /**
     *  Sign the arguments for the indexes provided, or sign them all
     * @param payload
     */
    static signArguments(payload: { args: any[], address: string, key: string, indexes: number[] }): string {
        if (!payload) {
            throw new Error('insufficient indexes');
        }
        if (!Array.isArray(payload.args) || !payload.args.length) {
            throw new Error('insufficient args');
        }

        const indexMap = {};
        const indexes: any = payload.indexes && payload.indexes.length ? payload.indexes : [...Array(payload.args.length).keys()]
        for (const index of indexes) {
            if (index > (payload.args.length - 1)) {
                throw new Error('index out of bounds');
            }
            if (index < 0) {
                throw new Error('index out of bounds negative');
            }
            if (indexMap[index]) {
                throw new Error('duplicate index');
            }
            indexMap[index] = true;
        }
        const usedArgs: any = [];
        for (const index of indexes) {
            let selectedArg = payload.args[index];
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
                    throw new Error('string must be hex encoded');
                }
                selectedArg = Buffer.from(selectedArg, 'hex');
            } else if (Buffer.isBuffer(selectedArg)) {
                // Force adding a 0x00 into the data since that's how it will be encoded in OP_RETURN field
                if (selectedArg.length === 0) {
                    selectedArg = Buffer.from('00', 'hex');
                }
            } else {
                throw new Error('invalid argument type should be Buffer or a hex string');
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
        const signature = bsv.Message(appData).sign(bsv.PrivateKey(payload.key))
        const verified = bsv.Message(appData).verify(payload.address, signature);
        if (!verified) {
            throw new Error('Signature verification failure' + signature);
        }
        return signature;
    }

    /**
     * Build author identity OP_RETURN fields
     * @param payload
     * @param include0x Whether to include '0x' in the outpout of each hex string or not
     */
    static buildAuthorIdentity(payload: { args: any[], address: string, key: string, indexes: number[] }, include0x: boolean = true): Array<string> {
        const signature = Utils.signArguments(payload);
        function toHex(d) {
            return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
        }
        let indexes: any = payload.indexes;
        if (!payload.indexes || payload.indexes.length == 0) {
            indexes = [...Array(payload.args.length).keys()];
        }
        for (let count = 0; count < indexes; count++) {
            indexes[count] = include0x ? '0x' + toHex(indexes[count]) : toHex(indexes[count]);
        }
        let indexesCount = indexes.length;
        indexesCount = include0x ? '0x' + toHex(indexesCount) : toHex(indexesCount);

        const constructed = [
            '0x' + Buffer.from(authorIdentityPrefix).toString('hex'),
            '0x' + Buffer.from('1.0.0').toString('hex'),
            '0x' + Buffer.from('ECDSA').toString('hex'),
            '0x' + Buffer.from(payload.address).toString('hex'),
            '0x' + Buffer.from(signature, 'base64').toString('hex')
        ];

        let negativeOffset = payload.args.length;
        let negativeOffsetStr = include0x ? '0x' + toHex(negativeOffset) : toHex(negativeOffset)

        constructed.push(negativeOffsetStr);
        constructed.push(indexesCount);
        for (const index of indexes) {
            const indexStr = include0x ? '0x' + toHex(index) : toHex(index);
            constructed.push(indexStr);
        }
        return constructed;
    }

    static validateAuthorIdentityOccurenceAtPos(args: any[], pos: number): boolean {
        if (!args[pos]) {
            return false;
        }
        // Enforce versions and positions
        const versionStringPos = 1;
        if (!args[pos + versionStringPos] || Buffer.from(args[pos + versionStringPos], 'hex').toString() !== '1.0.0') {
            return false;
        }
        const algorithmSchemePos = 2;
        if (!args[pos + algorithmSchemePos] || Buffer.from(args[pos + algorithmSchemePos], 'hex').toString() !== 'ECDSA') {
            return false;
        }

        const addressPos = 3;
        if (!args[pos + addressPos]) {
            return false;
        }
        const address = Buffer.from(args[pos + addressPos], 'hex').toString();
        const signaturePos = 4;
        if (!args[pos + signaturePos]) {
            return false;
        }
        const signature = Buffer.from(args[pos + signaturePos], 'hex').toString('base64');

        const offsetPos = 5;
        if (!args[pos + offsetPos]) {
            return false;
        }
        const offset = parseInt(args[pos + offsetPos], 16);

        const indexCountPos = 6;
        if (!args[pos + indexCountPos]) {
            return false;
        }
        const indexCount = parseInt(args[pos + indexCountPos], 16);

        if (offset <= 0 || indexCount <= 0) {
            return false;
        }

        const fieldIndexesForSignature: any[] = [];
        for (let indexIter = 1;  indexIter <= indexCount; indexIter++) {
            if ((pos + indexCountPos + indexIter) < 0) {
                return false;
            }
            if ((pos + indexCountPos + indexIter) >= args.length) {
                return false;
            }
            if (!args[pos + indexCountPos + indexIter]) {
                return false;
            }
            fieldIndexesForSignature.push(parseInt(args[pos + indexCountPos + indexIter], 16));
        }
        const fieldsToSign: any[] = [];
        for (const index of fieldIndexesForSignature) {
            if ((pos - offset + index) < 0) {
                return false;
            }
            if ((pos - offset + index) >= args.length) {
                return false;
            }
            if (!args[pos - offset + index]) {
                return false;
            }
            fieldsToSign.push(args[pos - offset + index]);
        }
        const bufWriter = new bsv.encoding.BufferWriter();
        for (const fieldToSign of fieldsToSign) {
            let bf = Buffer.from(fieldToSign, 'hex');
            bufWriter.write(bf);
        }
        const appData = bufWriter.toBuffer();
        try {
            const verified = bsv.Message(appData).verify(address, signature);
            if (verified) {
               return true;
            }
        } catch (ex) {
            console.log('verify ex', ex);
        }
        return false;
    }

    /**
     *
     * @param args Args of OP_RETURN (hex encoded with optional leading '0x'
     */
    static verifyAuthorIdentity(args: any[], include0x: boolean = true): boolean {
        let signaturesFound = 0;
        let signaturesMatched = 0;
        let verifiedAtLeastOne = false;
        // Remove any '0x' prefix if present
        const cleanedArgs: any[] = [];
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
                signaturesFound++;
                const validated = Utils.validateAuthorIdentityOccurenceAtPos(cleanedArgs, scanPrefixCounter);
                if (validated) {
                    verifiedAtLeastOne = true;
                    signaturesMatched++;
                } else {
                    return false;
                }
            }
        }
        return verifiedAtLeastOne && signaturesFound > 0 && signaturesFound === signaturesMatched;
    }
}