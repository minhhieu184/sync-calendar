import { ApiPromise, WsProvider } from '@polkadot/api'
import { WESTEND_RELAY_RPC } from './constants'

/**
 * Establish a api
 */
export function establishConnection(): Promise<ApiPromise> {
  const rpc = WESTEND_RELAY_RPC
  const wsProvider = new WsProvider(rpc)
  return ApiPromise.create({ provider: wsProvider })
}
