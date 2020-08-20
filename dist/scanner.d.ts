export declare class BlockchainScanner {
    options: {
        api_base: string;
        media_base: string;
        stream_base: string;
    };
    filterParams: any;
    started: boolean;
    mempoolConnectionEventSource: any;
    mempoolSecondaryConnectionEventSource: any;
    nextHeight_: number;
    saveHeightPath: any;
    saveUpdatedHeight: any;
    mempoolHandler: any;
    blockHandler: any;
    errorHandler: any;
    blockIntervalTimer: any;
    id: any;
    time: any;
    debug: any;
    fromMempool: any;
    fromBlocks: any;
    onlyblocks: any;
    processConnectBlocks: boolean;
    constructor(options?: {
        initHeight: number;
        saveUpdatedHeight?: boolean;
        saveHeightPath?: string;
        id?: string;
        debug?: boolean;
        fromMempool?: boolean;
        fromBlocks?: boolean;
        time?: number;
    });
    getId(): string;
    loadSavedHeight(): Promise<void>;
    nextHeight(): number;
    incrementNextHeight(): Promise<void>;
    filter(params: {
        baseFilter?: string;
        outputFilter?: string[];
        outputFilterId?: string;
    }): this;
    mempool(fn: Function): this;
    block(fn: Function): this;
    error(fn: Function): this;
    replayLastBlock(): void;
    start(fn?: Function): Promise<true | this>;
    stop(fn?: Function): void;
    private reconnectMempoolSafe;
    private disconnectMempool;
    private disconnectSecondaryMempool;
    private connectSecondaryMempool;
    private connectMempool;
    private getFilterUrlQuery;
    private getMempoolUrl;
    private getBlockUrl;
    private disconnectBlocks;
    /**
     * Have a N=10 second timer to check for blocks
     */
    private connectBlocks;
    private getBlockhashByHeight;
    private sleep;
    private triggerMempool;
    private triggerBlock;
    private triggerError;
}
