import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { ISubmittableResult } from '@polkadot/types/types'
import { BN } from 'bn.js'
import { POLKADOT_EXISTENTIAL_DEPOSIT } from './constants.js'
import type { Amount, PublicKey, Recipient, References, TokenID } from './types.js'

/**
 * Thrown when a Solana Pay transfer transaction can't be created from the fields provided.
 */
export class CreateTransferError extends Error {
  name = 'CreateTransferError'
}

/**
 * Fields of a Solana Pay transfer request URL.
 */
export interface CreateTransferFields {
  /** `recipient` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#recipient). */
  recipient: Recipient
  /** `amount` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#amount). */
  amount: Amount
  /** `spl-token` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#spl-token). */
  tokenID?: TokenID
  /** `reference` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#reference). */
  reference?: References
}

/**
 * Create a Solana Pay transfer transaction.
 *
 * @param connection - A connection to the cluster.
 * @param sender - Account that will send the transfer.
 * @param fields - Fields of a Solana Pay transfer request URL.
 * @param options - Options for `getRecentBlockhash`.
 *
 * @throws {CreateTransferError}
 */
export async function createTransfer(
  api: ApiPromise,
  sender: PublicKey,
  { recipient, amount, tokenID, reference }: CreateTransferFields
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
  // A native SOL or SPL token transfer instruction
  const extrinsic = tokenID
    ? await createTokenTransferExtrinsic(recipient, amount, reference, tokenID, sender, api)
    : await createNativeTransferExtrinsic(recipient, amount, reference, sender, api)

  return extrinsic
}

async function createNativeTransferExtrinsic(
  recipient: PublicKey,
  amount: Amount,
  reference: References | undefined,
  sender: PublicKey,
  api: ApiPromise
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
  // Check that the recipient account exists
  const { isEmpty: isRecipientEmpty } = await api.query.system.account(recipient)
  if (isRecipientEmpty) throw new CreateTransferError('Recipient account not found')

  // Check that the sender account exists and has enough balance
  const { data: balance, isEmpty: isSenderEmpty } = await api.query.system.account(sender)
  if (isSenderEmpty) throw new CreateTransferError('Sender account not found')
  const transferableBalance = balance.free.sub(
    BN.max(POLKADOT_EXISTENTIAL_DEPOSIT, balance.frozen.sub(balance.reserved))
  )
  if (transferableBalance.lt(amount))
    throw new CreateTransferError(`Account exists but seems inactive (no balance and nonce 0).`)

  if (reference) {
    return api.tx.utility.batch([
      api.tx.balances.transferKeepAlive(recipient, amount),
      api.tx.system.remark(Buffer.from(JSON.stringify(reference)).toString('base64'))
    ])
  } else {
    return api.tx.balances.transferKeepAlive(recipient, amount)
  }
}

async function createTokenTransferExtrinsic(
  recipient: PublicKey,
  amount: Amount,
  reference: References | undefined,
  tokenID: string,
  sender: PublicKey,
  api: ApiPromise
): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
  // Check that the token provided is an initialized mint
  const asset = await api.query.assets.asset(tokenID)
  if (asset.isEmpty) throw new CreateTransferError('asset not initialized')
  if (!asset.value.status.isLive) throw new CreateTransferError('asset frozen or destroyed')

  const assetsAccount = await api.query.assets.account(tokenID, sender)
  if (assetsAccount.isEmpty) throw new CreateTransferError('sender does not own the asset')
  if (!assetsAccount.value.status.isLiquid)
    throw new CreateTransferError('asset of sender is not liquid')
  if (assetsAccount.value.balance.lt(amount)) throw new CreateTransferError('insufficient funds')

  if (reference) {
    return api.tx.utility.batch([
      api.tx.assets.transferKeepAlive(tokenID, recipient, amount),
      api.tx.system.remark(Buffer.from(JSON.stringify(reference)).toString('base64'))
    ])
  } else {
    return api.tx.assets.transferKeepAlive(tokenID, recipient, amount)
  }
}
