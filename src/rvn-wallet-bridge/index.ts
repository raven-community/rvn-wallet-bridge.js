import IRVNWalletBridge from "./IRVNWalletBridge"
import Network from "./entities/Network"
import IllegalArgumentException from "./entities/IllegalArgumentException"
import ProviderException from "./entities/ProviderException"
import { findNetwork } from "./networks"
import { isLegacyAddress, isP2SHAddress, toLegacyAddress} from "rvnaddrjs"
import * as ravencoinjs from "ravencoinjs"
import IWalletProvider from "rvn-wallet-bridge-provider-interface/lib/IWalletProvider"
import ChangeType from "rvn-wallet-bridge-provider-interface/lib/entities/ChangeType"
import Utxo from "rvn-wallet-bridge-provider-interface/lib/entities/Utxo"
import Output from "rvn-wallet-bridge-provider-interface/lib/entities/Output"

export default class RVNWalletBridge implements IRVNWalletBridge {
  private defaultDAppId?: string

  constructor(public walletProvider?: IWalletProvider) {}

  // public getAssetAddress(
  //   changeType: ChangeType,
  //   index?: number,
  //   assetName: string
  // ): Promise<string> {
  //   return this.getAddresses(changeType, index, 1, dAppId)
  //     .then((addresses) => {
  //       const address = addresses[0]
  //       if (typeof address !== "string") {
  //         throw new ProviderException("The return value is invalid.")
  //       }
  //       return address
  //     })
  //     .catch((e) => { throw new ProviderException(e) })
  // }

  // public getAssetAddressIndex(
  //   changeType: ChangeType,
  //   assetName: string
  // ): Promise<number> {
  //   const walletProvider = this.checkWalletProvider()
  //   return walletProvider.getAddressIndex(changeType, dAppId || this.defaultDAppId)
  //     .then((index) => {
  //       if (!Number.isInteger(index) || index < 0 || index > 2147483647) {
  //         throw new ProviderException("The return value is invalid.")
  //       }
  //       return index
  //     })
  //     .catch((e) => { throw new ProviderException(e) })
  // }

  // public getAssetAddresses(
  //   changeType: ChangeType,
  //   startIndex?: number,
  //   size?: number,
  //   assetName: string
  // ): Promise<string[]> {
  //   if (startIndex) {
  //     if (!Number.isInteger(startIndex) || startIndex < 0 || startIndex > 2147483647) {
  //       throw new IllegalArgumentException("startIndex is an invalid value.")
  //     }
  //   }
  //   if (size !== undefined) {
  //     if (!Number.isInteger(size) || size < 1) {
  //       throw new IllegalArgumentException("size is an invalid value")
  //     }
  //   }
  //   if (startIndex && size) {
  //     if (startIndex + size > 2147483647) {
  //       throw new IllegalArgumentException("the max index must be <= 2147483647")
  //     }
  //   }
  //   const walletProvider = this.checkWalletProvider()
  //   return walletProvider.getAddresses(changeType, size || 1, startIndex, dAppId || this.defaultDAppId)
  //     .then((addresses) => {
  //       if (!(addresses instanceof Array) || addresses.length === 0 || typeof addresses[0] !== "string") {
  //         throw new ProviderException("The return value is invalid.")
  //       }
  //       return addresses
  //     })
  //     .catch((e) => { throw new ProviderException(e) })
  // }

  public async getUtxos(
    address: string
  ): Promise<Utxo[]> {
    const walletProvider = this.checkWalletProvider()
    const utxos: Utxo[] = []
    if (address) {
      const unspendableUtxos = await walletProvider.getUnspendableUtxos(address)
        .catch((e) => {
          throw new ProviderException(e)
        })
      const spendableUtxos = await walletProvider.getSpendableUtxos(address)
        .catch((e) => {
          throw new ProviderException(e)
        })
      if (!Array.isArray(unspendableUtxos) || !Array.isArray(spendableUtxos)) {
        throw new ProviderException("The provider returns illegal value.")
      }
      if ((unspendableUtxos.length !== 0 && !(unspendableUtxos[0] instanceof Utxo)) ||
        (spendableUtxos.length !== 0 && !(spendableUtxos[0] instanceof Utxo))) {
        throw new ProviderException("The provider returns illegal value.")
      }
      utxos.push(...unspendableUtxos)
      utxos.push(...spendableUtxos)
    } else {
      const spendableUtxos = await walletProvider.getSpendableUtxos()
        .catch((e) => {
          throw new ProviderException(e)
        })
      if (!Array.isArray(spendableUtxos)) {
        throw new ProviderException("The provider returns illegal value.")
      }
      if (spendableUtxos.length !== 0 && !(spendableUtxos[0] instanceof Utxo)) {
        throw new ProviderException("The provider returns illegal value.")
      }
      utxos.push(...spendableUtxos)
    }
    return utxos
  }

  public async getBalance(
    address: string
  ): Promise<number> {
    const utxos = await this.getUtxos(address)
    return utxos.reduce((balance, utxo) => balance + utxo.corbes, 0)
  }

  public async sign(
    address: string,
    dataToSign: string
  ): Promise<string> {
    if (!this.isLegacyAddress(address)) {
      throw new IllegalArgumentException("The address is not Legacy Address format.")
    }

    if (dataToSign.length === 0) {
      throw new IllegalArgumentException("The dataToSign cannot be empty.")
    }

    const walletProvider = this.checkWalletProvider()
    const signature = await walletProvider.sign(address, dataToSign)
      .catch((e) => {
        throw new ProviderException(e)
      })

    if (typeof signature !== "string") {
      throw new ProviderException("The wallet provider provides invalid value.")
    }

    return signature
  }

  public async buildTransaction(
    outputs: Output[],
    address: string
  ): Promise<string> {
    if (outputs.length === 0) {
      throw new IllegalArgumentException("The outputs cannot be empty.")
    }

    return this.createSignedTx(outputs, dAppId || this.defaultDAppId)
  }

  public async getProtocolVersion(): Promise<number> {
    const walletProvider = this.checkWalletProvider()
    const version = await walletProvider.getProtocolVersion()
      .catch((e) => { throw new ProviderException(e) })

    if (typeof version !== "number") {
      throw new ProviderException(`The wallet provider provides invalid type.`)
    }
    return version
  }

  public async getNetwork(): Promise<Network> {
    const walletProvider = this.checkWalletProvider()

    const magic = await walletProvider.getNetworkMagic()
      .catch((e) => {
        throw new ProviderException(e)
      })
    if (typeof magic !== "number") {
      throw new ProviderException("The wallet provider provides invalid type.")
    }

    return findNetwork(magic)
  }

  public getFeePerByte(): Promise<number> {
    const walletProvider = this.checkWalletProvider()
    return walletProvider.getFeePerByte()
      .then((fee) => {
        if (!Number.isInteger(fee) || fee < 1) {
          throw new ProviderException("The return value is invalid.")
        }
        return fee
      })
      .catch((e) => { throw new ProviderException(e) })
  }

  private isTxHash(target: string): boolean {
    const re = /[0-9A-Ffa-f]{64}/g
    return re.test(target)
  }

  // TODO: TEMP
  private checkWalletProvider = (): IWalletProvider => {
    if (!this.walletProvider) {
      throw new ProviderException("")
    }
    return this.walletProvider
  }

  private isP2SHLegacyAddress = (address: string): boolean => {
    try {
      if (!this.isLegacyAddress(address) || !isP2SHAddress(address)) {
        return false
      }
    } catch (e) {
      return false
    }
    return true
  }

  private isLegacyAddress = (address: string): boolean => {
    try {
      if (!isLegacyAddress(address)) {
        return false
      }
    } catch (e) {
      return false
    }
    return true
  }

  private toAddressFromScript = (script: string) => {
    const buf = Buffer.from(script, "hex")
    const hashed = ravencoinjs.crypto.Hash.sha256ripemd160(buf)
    const legacy = ravencoinjs.Address.fromScriptHash(hashed).toString()
    return toLegacyAddress(legacy)
  }

  private async createSignedTx(
    outputs: Output[]
  ): Promise<string> {
    const walletProvider = this.checkWalletProvider()
    const rawtx = await walletProvider.createSignedTx(outputs)
      .catch((e) => { throw new ProviderException(e) })
    if (typeof rawtx !== "string") {
      throw new ProviderException("The return value is invalid.")
    }
    return rawtx
  }
}
