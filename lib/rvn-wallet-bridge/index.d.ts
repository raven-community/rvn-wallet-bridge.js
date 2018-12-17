import IRVNWalletBridge from "./IRVNWalletBridge";
import Network from "./entities/Network";
import IWalletProvider from "rvn-wallet-bridge-provider-interface/lib/IWalletProvider";
import ChangeType from "rvn-wallet-bridge-provider-interface/lib/entities/ChangeType";
import Utxo from "rvn-wallet-bridge-provider-interface/lib/entities/Utxo";
import Output from "rvn-wallet-bridge-provider-interface/lib/entities/Output";
export default class RVNWalletBridge implements IRVNWalletBridge {
    walletProvider?: IWalletProvider | undefined;
    constructor(walletProvider?: IWalletProvider | undefined);
    getAssetAddress(changeType: ChangeType, index?: number, assetName: string): Promise<string>;
    getAssetAddressIndex(changeType: ChangeType, assetName: string): Promise<number>;
    getAssetAddresses(changeType: ChangeType, startIndex?: number, size?: number, assetName: string): Promise<string[]>;
    getUtxos(address: string): Promise<Utxo[]>;
    getBalance(address: string): Promise<number>;
    sign(address: string, dataToSign: string): Promise<string>;
    buildTransaction(outputs: Output[], address: string): Promise<string>;
    getProtocolVersion(): Promise<number>;
    getNetwork(): Promise<Network>;
    getFeePerByte(): Promise<number>;
    private isTxHash;
    private checkWalletProvider;
    private isP2SHLegacyAddress;
    private isLegacyAddress;
    private toAddressFromScript;
    private createSignedTx;
}
