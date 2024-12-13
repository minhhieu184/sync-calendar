import { ApiPromise } from '@polkadot/api'
import { Bytes, GenericExtrinsic } from '@polkadot/types'
import { AnyTuple } from '@polkadot/types-codec/types'
import { BlockHash, CodecHash } from '@polkadot/types/interfaces'
import type { References } from './types.js'

/**
 * Thrown when no transaction signature can be found referencing a given public key.
 */
export class FindReferenceError extends Error {
  name = 'FindReferenceError'
}

export interface FindReferenceResponse {
  blockHash: BlockHash | string | Uint8Array<ArrayBufferLike>
  extrinsicHash: CodecHash | string | Uint8Array<ArrayBufferLike>
}

export interface FindReferenceOption {
  retryBlock?: number
}

/**
 * Find the oldest transaction signature referencing a given public key.
 *
 * @param connection - A connection to the cluster.
 * @param reference - `reference` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#reference).
 * @param options - Options for `getSignaturesForAddress`.
 *
 * @throws {FindReferenceError}
 */
export async function findReference(
  api: ApiPromise,
  reference: References,
  { retryBlock = 50 }: FindReferenceOption | undefined = {}
): Promise<FindReferenceResponse | undefined> {
  return await new Promise<FindReferenceResponse | undefined>(async (resolve, reject) => {
    let count = 0
    const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(async (header) => {
      try {
        count++
        const blockHash = header.hash
        const targetEx = await findReferenceInBlock(api, header.hash, reference)
        if (targetEx) {
          unsubscribe()
          resolve({ blockHash, extrinsicHash: targetEx.hash })
        }
      } catch (error) {
        if (error instanceof FindReferenceError) {
          reject(error)
        }
      } finally {
        if (count == retryBlock) {
          unsubscribe()
          resolve(undefined)
        }
      }
    })
  })
}

export async function findReferenceInBlock(
  api: ApiPromise,
  blockHash: BlockHash | string | Uint8Array<ArrayBufferLike>,
  reference: References
): Promise<GenericExtrinsic<AnyTuple> | undefined> {
  const signedBlock = await api.rpc.chain.getBlock(blockHash)
  if (signedBlock.isEmpty) return

  // Find the extrinsics that include the transfer
  const ex = signedBlock.block.extrinsics.find((ex) => {
    const {
      isSigned,
      method: { args, method, section }
    } = ex

    if (!isSigned) return false
    if (`${section}.${method}` !== 'utility.batch') return false

    const referenceBytes: Bytes | undefined = args?.[0]?.[1]?.get('args')?.get('remark')
    if (!referenceBytes) return false

    const decoder = new TextDecoder()
    const referenceBase64 = decoder.decode(referenceBytes)
    const referenceArray = JSON.parse(Buffer.from(referenceBase64, 'base64').toString('ascii'))

    const targetReference = Array.isArray(reference) ? reference : [reference]

    return JSON.stringify(targetReference.sort()) === JSON.stringify(referenceArray.sort())
  })
  return ex
}
