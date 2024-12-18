import { decodeAddress } from '@polkadot/util-crypto'
import BN from 'bn.js'
import { POLKADOT_PROTOCOL } from './constants.js'
import type { Amount, Label, Link, Message, PublicKey, Recipient, Reference, TokenID } from './types'

/**
 * A Solana Pay transfer request URL.
 */
export interface TransferRequestURL {
  /** `recipient` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#recipient). */
  recipient: PublicKey
  /** `amount` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#amount). */
  amount: Amount | undefined
  /** `spl-token` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#spl-token). */
  tokenID: TokenID | undefined
  /** `reference` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#reference). */
  reference: Reference[] | undefined
  /** `label` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#label). */
  label: Label | undefined
  /** `message` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#message). */
  message: Message | undefined
}

/**
 * Thrown when a URL can't be parsed as a Solana Pay URL.
 */
export class ParseURLError extends Error {
  name = 'ParseURLError'
}

/**
 * Parse a Solana Pay URL.
 *
 * @param url - URL to parse.
 *
 * @throws {ParseURLError}
 */
export function parseURL(url: string | URL): TransferRequestURL {
  if (typeof url === 'string') {
    if (url.length > 2048) throw new ParseURLError('length invalid')
    url = new URL(url)
  }

  if (url.protocol !== POLKADOT_PROTOCOL) throw new ParseURLError('protocol invalid')
  if (!url.pathname) throw new ParseURLError('pathname missing')
  if (!/^[a-zA-Z0-9]+$/.test(url.pathname)) throw new ParseURLError('pathname invalid')

  return parseTransferRequestURL(url)
}

function parseTransferRequestURL(url: Link): TransferRequestURL {
  const { pathname, searchParams } = url
  let recipient: PublicKey
  try {
    recipient = decodeAddress(pathname)
  } catch (error: any) {
    throw new ParseURLError('recipient invalid')
  }

  let amount: Amount | undefined
  const amountParam = searchParams.get('amount')
  if (amountParam != null) {
    if (!/^[0-9]+$/.test(amountParam)) throw new ParseURLError('amount invalid')

    amount = new BN(amountParam)
    if (amount.ltn(0)) throw new ParseURLError('amount negative')
  }

  const tokenID: TokenID | undefined = searchParams.get('token-id') || undefined
  if (tokenID && !/^[0-9]+$/.test(tokenID)) throw new ParseURLError('token-id invalid')

  let reference: Reference[] | undefined = searchParams.getAll('reference')
  if (reference.length === 0) reference = undefined

  const label = searchParams.get('label') || undefined
  const message = searchParams.get('message') || undefined

  return {
    recipient,
    amount,
    tokenID,
    reference,
    label,
    message
  }
}
