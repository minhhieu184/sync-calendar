import { ApiPromise } from '@polkadot/api'
import { Bytes } from '@polkadot/types-codec'
import { AnyTuple } from '@polkadot/types-codec/types'
import { BlockHash, CodecHash } from '@polkadot/types/interfaces'
import { encodeAddress } from '@polkadot/util-crypto'
import BN from 'bn.js'
import { Amount, Recipient, References, TokenID } from './types'

/**
 * Thrown when a transaction doesn't contain a valid Solana Pay transfer.
 */
export class ValidateTransferError extends Error {
  name = 'ValidateTransferError'
}

/**
 * Fields of a Solana Pay transfer request to validate.
 */
export interface ValidateTransferFields {
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
 * Check that a given transaction contains a valid Solana Pay transfer.
 *
 * @param connection - A connection to the cluster.
 * @param signature - The signature of the transaction to validate.
 * @param fields - Fields of a Solana Pay transfer request to validate.
 * @param options - Options for `getTransaction`.
 *
 * @throws {ValidateTransferError}
 */
export async function validateTransfer(
  api: ApiPromise,
  blockHash: string | Uint8Array<ArrayBufferLike> | BlockHash,
  exHash: string | Uint8Array<ArrayBufferLike> | CodecHash,
  { recipient, amount, tokenID, reference }: ValidateTransferFields
): Promise<void> {
  const { block } = await api.rpc.chain.getBlock(blockHash)
  const exIndex = block.extrinsics.findIndex((ex) => ex.hash.eq(exHash))
  if (exIndex === -1) throw new ValidateTransferError('target extrinsic not in block')
  const ex = block.extrinsics[exIndex]
  const {
    isSigned,
    method: { args, method, section }
  } = ex

  if (!isSigned) throw new ValidateTransferError('unsigned extrinsic')
  if (`${section}.${method}` !== 'utility.batch')
    throw new ValidateTransferError('invalid method or section')

  // Check transaction success
  await validateTransactionSuccess(api, blockHash, exIndex)

  if (tokenID) {
    await validateTokenTransfer(api, args, tokenID, amount, recipient)
  } else {
    await validateNativeTransfer(args, amount, recipient)
  }

  // Check correct reference
  if (reference) validateReference(args, reference)
}

async function validateTransactionSuccess(
  api: ApiPromise,
  blockHash: string | Uint8Array<ArrayBufferLike> | BlockHash,
  exIndex: number
) {
  const apiAt = await api.at(blockHash)
  const allRecords = await apiAt.query.system.events()
  const records = allRecords.filter(
    ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(exIndex)
  )
  const isExtrinsicSuccess = records.some(({ event }) =>
    api.events.system.ExtrinsicSuccess.is(event)
  )
  if (!isExtrinsicSuccess) throw new ValidateTransferError('extrinsic failed')
}

function validateReference(args: AnyTuple, reference: References) {
  const targetReference = Array.isArray(reference) ? reference : [reference]

  const referenceBytes: Bytes | undefined = args?.[0]?.[1]?.get('args')?.get('remark')
  if (!referenceBytes) throw new ValidateTransferError('missing reference')
  const decoder = new TextDecoder()
  const referenceBase64 = decoder.decode(referenceBytes)
  const referenceInEx = JSON.parse(Buffer.from(referenceBase64, 'base64').toString('ascii'))

  const isReferenceCorrect =
    JSON.stringify(targetReference.sort()) === JSON.stringify(referenceInEx.sort())
  if (!isReferenceCorrect) throw new ValidateTransferError('wrong reference')
}

async function validateTokenTransfer(
  api: ApiPromise,
  args: AnyTuple,
  tokenID: TokenID,
  amount: BN,
  recipient: Recipient
) {
  // Check tokenID
  const { isEmpty } = await api.query.assets.asset(tokenID)
  if (isEmpty) throw new ValidateTransferError('tokenID not found')

  const tokenIDInEx: string | undefined = args?.[0]?.[0]?.get('args')?.get('id')?.toString()
  if (tokenIDInEx !== tokenID) throw new ValidateTransferError('wrong tokenID')

  // Check correct amount
  const amountInEx: string | undefined = args?.[0]?.[0]?.get('args')?.get('amount')?.toString()
  if (!amountInEx) throw new ValidateTransferError('missing amount')
  const isAmountCorrect = amount.eq(new BN(amountInEx))
  if (!isAmountCorrect) throw new ValidateTransferError('wrong amount')

  // Check recipient
  const recipientInEx: string | undefined = args?.[0]?.[0]?.get('args')?.get('target')?.toJSON().id
  if (recipientInEx !== encodeAddress(recipient)) throw new ValidateTransferError('wrong recipient')
}

async function validateNativeTransfer(args: AnyTuple, amount: BN, recipient: Recipient) {
  // Check correct amount
  const amountInEx: string | undefined = args?.[0]?.[0]?.get('args')?.get('value')?.toString()
  if (!amountInEx) throw new ValidateTransferError('missing amount')
  const isAmountCorrect = amount.eq(new BN(amountInEx))
  if (!isAmountCorrect) throw new ValidateTransferError('wrong amount')

  // Check recipient
  const recipientInEx: string | undefined = args?.[0]?.[0]?.get('args')?.get('dest')?.toJSON().id
  if (recipientInEx !== encodeAddress(recipient)) throw new ValidateTransferError('wrong recipient')
}
