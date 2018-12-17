import Network from "./entities/Network"
import { NetworkType } from "./entities/Network"

const networks = new Map<number, NetworkType>([
  [0x4e564152, NetworkType.MAINNET],
  [0x544e5652, NetworkType.TESTNET]
])

export const findNetwork = (magic: number) => {
  const type = networks.get(magic)
  if (type) {
    return new Network(magic, type)
  }
  return new Network(magic, NetworkType.UNKNOWN)
}
