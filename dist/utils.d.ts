export interface VerificationResult {
    verified: boolean;
    message?: string;
    signedFullyByAddresses?: Array<string>;
    addresses: Array<{
        address: string;
        verified: boolean;
        pos?: number;
        fieldIndexesForSignature?: number[];
    }>;
}
export declare class Utils {
    static isHex(str: string): boolean;
    /**
     * Check whether the indexes are provided
     */
    static isIndexesProvided(indexes: any): boolean;
    /**
     * Sign the arguments for the indexes provided, or sign them all.
     * This is not meant to be used directly if 0x6a is not the first payload.arg[0] value
     * @param payload
     */
    static signArguments(payload: {
        args: any[];
        address: string;
        key: string;
        indexes?: number[];
    }): string;
    /**
     * Build author identity OP_RETURN fields
     * @param payload
     * @param include0x Whether to include '0x' in the outpout of each hex string or not
     */
    static buildAuthorIdentity(payload: {
        args: any[];
        address: string;
        key: string;
        indexes?: number[];
    }): Array<string>;
    /**
     * Count the number of fields remaining in the OP_RETURN starting at startFieldIndex and then ending at either
     * when we find a '|' delimiter or reach end of array
     * @param args Arguments of OP_RETURN
     * @param startFieldIndex The first field to start counting from
     */
    static getCountOfFieldIndexesRemaining(args: any[], startFieldIndex: number): number;
    /**
     * Validate that the AUTHOR IDENTITY at the given position is valid
     *
     * @param args Arguments of the OP_RETURN to validate
     * @param pos Position that the AUTHOR IDENTITY prefix is found
     */
    static validateAuthorIdentityOccurenceAtPos(args: any[], pos: number): {
        valid: boolean;
        message?: string;
        address?: string;
        signature?: string;
        pos?: number;
        fieldIndexesForSignature?: number[];
    };
    /**
     * @param args Args of OP_RETURN (hex encoded with optional leading '0x')
     * @param expectedAuthorAddresses Single address or array addresses that are expected to sign in order
     */
    static verifyAuthorIdentity(args: any[], expectedAuthorAddresses: string[] | string): VerificationResult;
    static areAllFieldsIncludedUpto(indexes: number[] | undefined, position: number | undefined): boolean;
    /**
     * Detect and verify author identities by rawtx
     * @param rawtx Raw transaction to detect OP_RETURN with author identity in one of the outputs.
     */
    static detectAndVerifyAuthorIdentitiesByTx(rawtx: string): VerificationResult;
    /**
     * Detect and verify author identities
     * @param args Args of OP_RETURN (hex encoded with optional leading '0x')
     * @param safe whether to use safe OP_FALSE op return data
     */
    static detectAndVerifyAuthorIdentities(args: any[], safe?: boolean): VerificationResult;
}
