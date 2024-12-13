import { AddressOrPair } from '@polkadot/api/types'
import BN from 'bn.js'

// export type LikeAddress =
//   | string
//   | Uint8Array<ArrayBufferLike>
//   | GenericMultiAddress
//   | {
//       Id: any
//     }
//   | {
//       Index: any
//     }
//   | {
//       Raw: any
//     }
//   | {
//       Address32: any
//     }
//   | {
//       Address20: any
//     }
export type PublicKey = Uint8Array<ArrayBufferLike>

/** `recipient` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#recipient). */
export type Recipient = PublicKey

/** `amount` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#amount). */
export type Amount = BN

/** `spl-token` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#spl-token). */
export type TokenID = string

/** `reference` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#reference). */
export type Reference = string

/** `reference` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#reference). */
export type References = Reference | Reference[]

/** `label` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#label). */
export type Label = string

/** `message` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#message). */
export type Message = string

/** `memo` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#memo). */
export type Memo = string

/** `link` in the [Solana Pay spec](https://github.com/solana-labs/solana-pay/blob/master/SPEC.md#link). */
export type Link = URL
