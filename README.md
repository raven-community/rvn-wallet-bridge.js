# rvn-wallet-bridge.js - Bridge between Ravencoin application and wallet

## About
Ravencoin applications don't have to be castodial wallet anymore.
With `rvn-wallet-bridge.js`, they can request flexible actions to their users' wallet.

## Installation
`yarn add rvn-wallet-bridge`

## Usage
```ts
import RVNWalletBridge from "rvn-wallet-bridge"
const injected = window.ravencoin
if (!injected || !injected.wallet) {
  console.log("RVNWalletBridge wallet isn't injected!")
  return
}
const rvnWalletBridge = new RVNWalletBridge(injected.wallet)
```

## What is DApp ID?
DApp ID is a unique identifiers for a single DApp, and it's a txid of Ravencoin transaction.
Each DApp writes its protocol specification in the tranasction's OP_RETURN output.

It is defined in [BDIP-2](https://github.com/web3bch/BDIPs/blob/master/BDIPs/bdip-2.md).

## Documentation

Documentation can be found at [GitHub Pages][docs].

[docs]: https://web3bch.github.io/bch-wallet-bridge.js/

## Building
### Requirements
- Node.js
- npm
- yarn

### Build (tsc)
1. `$ yarn`
2. `$ yarn build`
