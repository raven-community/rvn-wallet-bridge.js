declare module "rvnaddrjs" {
  function isLegacyAddress(address: string): boolean
  function isP2SHAddress(address: string): boolean
  function toP2SHAddress(address: string): string
  function toLegacyAddress(address: string): string
}
