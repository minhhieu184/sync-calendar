import { encodeAddress } from '@polkadot/util-crypto'
import { POLKADOT_PROTOCOL } from './constants'
import type { Amount, Label, Memo, Message, Recipient, References, TokenID } from './types'

/**
 * Fields of a Solana Pay transfer request URL.
 */
export interface TransferRequestURLFields {
  /** `recipient` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#recipient). */
  recipient: Recipient
  /** `amount` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#amount). */
  amount?: Amount
  /** `spl-token` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#spl-token). */
  tokenID?: TokenID
  /** `reference` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#reference). */
  reference?: References
  /** `label` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#label). */
  label?: Label
  /** `message` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#message).  */
  message?: Message
  /** `memo` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#memo). */
  memo?: Memo
}

/**
 * Encode a Solana Pay URL.
 *
 * @param fields Fields to encode in the URL.
 */
export function encodeURL(fields: TransferRequestURLFields): URL {
  return encodeTransferRequestURL(fields)
}

function encodeTransferRequestURL({
  recipient,
  amount,
  tokenID,
  reference,
  label,
  message,
  memo
}: TransferRequestURLFields): URL {
  const pathname = encodeAddress(recipient)
  const url = new URL(POLKADOT_PROTOCOL + pathname)

  if (amount) {
    url.searchParams.append('amount', amount.toString())
  }
  if (tokenID) {
    url.searchParams.append('token-id', tokenID)
  }

  if (reference) {
    if (!Array.isArray(reference)) reference = [reference]
    for (const ref of reference) {
      url.searchParams.append('reference', ref)
    }
  }

  if (label) {
    url.searchParams.append('label', label)
  }
  if (message) {
    url.searchParams.append('message', message)
  }
  if (memo) {
    url.searchParams.append('memo', memo)
  }

  return url
}
