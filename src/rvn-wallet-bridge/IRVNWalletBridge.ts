import Network from "./entities/Network"
import IWalletProvider from "rvn-wallet-bridge-provider-interface/lib/IWalletProvider"
import ChangeType from "rvn-wallet-bridge-provider-interface/lib/entities/ChangeType"
import Output from "rvn-wallet-bridge-provider-interface/lib/entities/Output"
import Utxo from "rvn-wallet-bridge-provider-interface/lib/entities/Utxo"

export default interface IRVNWalletBridge {
  /**
   * The current provider set.
   */
  walletProvider?: IWalletProvider
  /**
   * Returns the current wallet address.
   * @example
   * const address = await rvnWalletBridge.getAddress(
   *   "receive",
   *   3,
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(address)
   * > "ravencoin:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p"
   * @param changeType The BIP44 change path type.
   * @param index The BIP44 address_index path.
   * @param assetName The rvn asset. If no asset is set the default asset will be set.
   * @returns The current wallet address.
   */
  // getAssetAddress(
  //   changeType: ChangeType,
  //   index?: number,
  //   assetName: string
  // ): Promise<string>

  /**
   * Returns the current wallet address index.
   * @example
   * const addrIdx = await rvnWalletBridge.getAddressIndex(
   *   "change",
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(addrIdx)
   * > 3
   * @param changeType The BIP44 change path type.
   * @param AssetName The rvn asset. If no asset is set the default asset will be set.
   * @returns The current wallet address index.
   */
  // getAssetAddressIndex(
  //   changeType: ChangeType,
  //   assetName: string
  // ): Promise<number>

  /**
   * Returns the wallet address list.
   * @example
   * const addresses = await rvnWalletBridge.getAddresses(
   *   "receive",
   *   3,
   *   2,
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(addresses)
   * > ["ravencoin:qrsy0xwugcajsqa...", "ravencoin:qrsfpepw3egqq4k..."]
   * @param changeType The BIP44 change path type.
   * @param startIndex The BIP44 address_index path.
   * @param size The address amount you want.
   * @param assetName The rvn asset. If no asset is set the default asset will be set.
   * @returns The wallet address list.
   */
  // getAssetAddresses(
  //   changeType: ChangeType,
  //   startIndex?: number,
  //   size?: number,
  //   assetName: string
  // ): Promise<string[]>

  /**
   * Returns the unspent transaction outputs.
   * @example
   * const utxos = await rvnWalletBridge.getUtxos(
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(utxos)
   * > [
   *     {
   *       'txId' : '115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986',
   *       'outputIndex' : 0,
   *       'address' : 'ravencoin:qrsy0xwugcajsqa99c9nf05pz7ndckj55ctlsztu2p',
   *       'script' : '76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac',
   *       'corbes' : 50000
   *     }
   *   ]
   * @param addres The rvn address. If no address is set the default address will be set.
   * @returns The unspent transaction output object list.
   */
  getUtxos(
    address: string
  ): Promise<Utxo[]>

  /**
   * Returns the balance of the addresses.
   * @example
   * const balance = await rvnWalletBridge.getBalance(
   *   "53212266f7994100e442f6dff10fbdb50a93121d25c196ce0597517d35d42e68"
   * )
   * console.log(balance)
   * > 500000
   * @param address The rvn address. If no address is set the default address will be set.
   * @returns The current balance for the addresses in corbe.
   */
  getBalance(
    address: string
  ): Promise<number>

  /**
   * Signs data from a specific account. This account needs to be unlocked.
   * @example
   * const result = await rvnWalletBridge.sign(
   *   "ravencoin:qq28xgrzkdyeg5vf7tp2s3mvx8u95zes5cf7wpwgux",
   *   "af4c61ddcc5e8a2d..." // second argument is SHA1("hello")
   * )
   * console.log(result)
   * > "30440220227e0973..."
   * @param address Address to sign with.
   * @param dataToSign Data to sign in hex format.
   * @returns The signed data. RAvencoin signatures are serialised in the DER format over the wire.
   */
  sign(
    address: string,
    dataToSign: string
  ): Promise<string>

  /**
   * Create a transaction with specified outputs and return the signed raw transaction.
   * The provider will not add any outputs. The ordering of outputs remains as is.
   * @example
   * const rawTx = await rvnWalletBridge.buildTransaction([
   *   {
   *     lockScript: "76a91467b2e55ada06c869547e93288a4cf7377211f1f088ac",
   *     amount: 10000
   *   }
   * ])
   * console.log(rawtx)
   * > "..."
   * @param outputs The Array of TransactionOutput objects. Throws an error, when the array is empty.
   * @param address The rvn address. If no address is set the default address will be set.
   * @returns The signed raw transaction.
   */
  buildTransaction(
    outputs: Output[],
    address: string
  ): Promise<string>

  /**
   * Returns the ravencoin protocol version.
   * @example
   * const version = await rvnWalletBridge.getProtocolVersion()
   * console.log(version)
   * > 70015
   * @returns The protocol version. The value is Int32.
   */
  getProtocolVersion(): Promise<number>

  /**
   * Returns the current network.
   * @example
   * const network = await rvnWalletBridge.getNetwork()
   * console.log(network)
   * > {
   *     magicBytes: "e3e1f3e8",
   *     name: "Mainnet"
   *   }
   * @returns The network object.
   */
  getNetwork(): Promise<Network>

  /**
   * Returns the transaction fee per byte.
   * @example
   * const fee = await rvnWalletBridge.getFeePerByte()
   * console.log(fee)
   * > 1
   * @returns Transaction fee per byte in corbe.
   */
  getFeePerByte(): Promise<number>
