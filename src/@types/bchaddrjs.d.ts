declare module "rvnaddrjs" {
  function isRvn2Address(address: string): boolean
  function isP2SHAddress(address: string): boolean
  function toRvn2Address(address: string): string
  function toLegacyAddress(address: string): string
}
