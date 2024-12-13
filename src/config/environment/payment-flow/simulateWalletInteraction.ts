import { ApiPromise, Keyring } from '@polkadot/api'
import BN from 'bn.js'
import { createTransfer, parseURL } from '../lib'
import { CUSTOMER_MNEMONIC } from './constants'

export async function simulateWalletInteraction(api: ApiPromise, url: URL) {
  /**
   * For example only
   *
   * The URL that triggers the wallet interaction; follows the Solana Pay URL scheme
   * The parameters needed to create the correct transaction is encoded within the URL
   */
  const { recipient, amount, reference, label, message } = parseURL(url)
  console.log('SimulatePolkadotPayService ~ simulateWalletInteraction ~ parseURL:', {
    recipient: recipient.toLocaleString(),
    amount,
    reference,
    label,
    message
  })
  console.log('label: ', label)
  console.log('message: ', message)

  const fallbackAmount = new BN(Math.pow(10, 12)) // 1 WND

  /**
   * Create the transaction with the parameters decoded from the URL
   */
  const customerKeyring = new Keyring({ type: 'sr25519' }).addFromMnemonic(CUSTOMER_MNEMONIC)
  const tx = await createTransfer(api, customerKeyring.publicKey, {
    recipient,
    amount: amount || fallbackAmount,
    reference
  })

  /**
   * Send the transaction to the network
   */
  // const unsub = await tx.signAndSend(CUSTOMER_KEYRING_PAIR, ({ events = [], status, txHash }) => {
  //   console.log(`Current status is ${status.type}`)
  //   if (status.isInBlock) {
  //     console.log(`\tTransaction included at blockHash ${status.asInBlock}`)
  //   }
  //   if (status.isFinalized) {
  //     console.log(`\tTransaction finalized at blockHash ${status.asFinalized}`)
  //     console.log(`\tTransaction hash ${txHash.toHex()}`)
  //     console.log(`\t ✅ Westend Subscan: https://westend.subscan.io/extrinsic/${txHash.toHex()}`)
  //     // Loop through Vec<EventRecord> to display all events
  //     events.forEach(({ phase, event: { data, method, section } }) => {
  //       console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
  //     })
  //     unsub()
  //   }
  // })
}
