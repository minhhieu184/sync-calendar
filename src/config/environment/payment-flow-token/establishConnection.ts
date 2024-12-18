import { ApiPromise, WsProvider } from '@polkadot/api'
import { WESTEND_ASSET_HUB_RPC } from './constants'

/**
 * Establish a api
 */
export function establishConnection(): Promise<ApiPromise> {
  const wsProvider = new WsProvider(WESTEND_ASSET_HUB_RPC)
  return ApiPromise.create({ provider: wsProvider })
}
