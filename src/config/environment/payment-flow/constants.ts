import { decodeAddress } from '@polkadot/util-crypto'
import { Recipient } from '../lib'

export const MERCHANT_WALLET: Recipient = decodeAddress(
  '5D7En1GPDt159tny2drpwiUkqGdYU84e4Mm8GSnis48zNtAw'
)

// Mnemonic purely for testing purposes.
export const CUSTOMER_MNEMONIC = ''

export const WESTEND_RELAY_RPC = 'wss://westend-rpc.polkadot.io'
export const WESTEND_ASSET_HUB_RPC = 'wss://sys.ibp.network/asset-hub-westend'
