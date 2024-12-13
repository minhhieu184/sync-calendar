import { Injectable } from '@nestjs/common'
import { encodeURL, findReference, validateTransfer } from '../lib'
import { MERCHANT_WALLET } from './constants'
import { establishConnection } from './establishConnection'
import { simulateCheckout } from './simulateCheckout'
import { simulateWalletInteraction } from './simulateWalletInteraction'
// import { validateTransfer } from './lib/validateTransfer'

@Injectable()
export class PaymentFlowService {
  async onModuleInit() {
    console.log("Let's simulate a Polkadot Pay flow ... \n")
    let paymentStatus: string

    console.log('1. ✅ Establish connection to the cluster')
    const api = await establishConnection()

    /**
     * Simulate a checkout experience
     *
     * Recommendation:
     * `amount` and `reference` should be created in a trusted environment (server).
     * The `reference` should be unique to a single customer session,
     * and will be used to find and validate the payment in the future.
     *
     * Read our [getting started guide](#getting-started) for more information on the parameters.
     */
    console.log('\n2. 🛍 Simulate a customer checkout \n')
    const { label, message, amount, reference } = await simulateCheckout()
    console.log('SimulatePolkadotPayService ~ onModuleInit ~ simulateCheckout:', {
      label,
      message,
      amount,
      reference: reference.toLocaleString()
    })

    /**
     * Create a payment request link
     *
     * Solana Pay uses a standard URL scheme across wallets for native SOL and SPL Token payments.
     * Several parameters are encoded within the link representing an intent to collect payment from a customer.
     */
    console.log('3. 💰 Create a payment request link \n')
    const url = encodeURL({
      recipient: MERCHANT_WALLET,
      amount,
      reference,
      label,
      message
    })
    console.log('SimulatePolkadotPayService ~ onModuleInit ~ url:', url.toString())

    /**
     * Simulate wallet interaction
     *
     * This is only for example purposes. This interaction will be handled by a wallet provider
     */
    console.log('4. 🔐 Simulate wallet interaction \n')
    simulateWalletInteraction(api, url)

    // Update payment status
    paymentStatus = 'pending'

    /**
     * Wait for payment to be confirmed
     *
     * When a customer approves the payment request in their wallet, this transaction exists on-chain.
     * You can use any references encoded into the payment link to find the exact transaction on-chain.
     * Important to note that we can only find the transaction when it's **confirmed**
     */
    // console.log('\n5. 💲Find the transaction')
    // console.count('Checking for transaction...')
    // const findReferenceResponse = await findReference(api, reference)
    // if (!findReferenceResponse) {
    //   console.log('🟥 Cannot found target extrinsic not found')
    //   return
    // }
    // const { blockHash, extrinsicHash } = findReferenceResponse

    // // Update payment status
    // paymentStatus = 'confirmed'

    // /**
    //  * Validate transaction
    //  *
    //  * Once the `findTransactionSignature` function returns a signature,
    //  * it confirms that a transaction with reference to this order has been recorded on-chain.
    //  *
    //  * `validateTransactionSignature` allows you to validate that the transaction signature
    //  * found matches the transaction that you expected.
    //  */
    // console.log('\n6. 🔗 Validate transaction \n')

    // try {
    //   await validateTransfer(api, blockHash, extrinsicHash, {
    //     recipient: MERCHANT_WALLET,
    //     amount,
    //     reference
    //   })

    //   // Update payment status
    //   paymentStatus = 'validated'
    //   console.log('✅ Payment validated')
    //   console.log('📦 Ship order to customer')
    // } catch (error) {
    //   console.error('❌ Payment failed', error)
    // }
  }
}
