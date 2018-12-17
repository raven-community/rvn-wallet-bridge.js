export declare enum NetworkType {
    MAINNET = "Mainnet",
    TESTNET = "Testnet",
    UNKNOWN = "Unknown"
}
export default class Network {
    /**
     * Network magic bytes
     */
    magic: number;
    /**
     * Network name
     */
    name: NetworkType;
    constructor(magic: number, name: NetworkType);
}
