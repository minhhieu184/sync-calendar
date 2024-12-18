import BN from 'bn.js'
import { randomUUID } from 'crypto'
import { References, TokenID } from '../lib'
import { TOKEN_ID } from './constants'

/**
 * Simulate a checkout experience
 *
 * Recommendation:
 * `amount` and `reference` should be created in a trusted environment (server).
 * The `reference` should be unique to a single customer session,
 * and will be used to find and validate the payment in the future.
 *
 * Read our [getting started guide](#getting-started-guide) for more information on what these parameters mean.
 */
export async function simulateCheckout(): Promise<{
  label: string
  message: string
  amount: BN
  tokenID: TokenID
  reference: References
}> {
  return {
    label: 'Jungle Cats store',
    message: 'Jungle Cats store - your order - #001234',
    tokenID: TOKEN_ID,
    amount: new BN(1000 * Math.pow(10, 10)), // 1000 IPP
    reference: randomUUID()
  }
}
