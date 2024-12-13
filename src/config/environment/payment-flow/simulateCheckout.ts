import BN from 'bn.js'
import { randomUUID } from 'crypto'
import { References } from '../lib'

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
  reference: References
}> {
  return {
    label: 'Jungle Cats store',
    message: 'Jungle Cats store - your order - #001234',
    amount: new BN(Math.pow(10, 12)), // 1 WND
    reference: randomUUID()
  }
}
