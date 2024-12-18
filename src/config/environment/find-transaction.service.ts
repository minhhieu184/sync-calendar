import { Injectable } from '@nestjs/common'
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api'
import { Bytes } from '@polkadot/types'

@Injectable()
export class ListenTransactionService {
  async onModuleInit1() {
    console.log("Let's listen to a transaction ... \n")

    const rpc = 'wss://westend-rpc.polkadot.io'
    // Construct
    const wsProvider = new WsProvider(rpc)
    const api = await ApiPromise.create({ provider: wsProvider })

    // Create a keyring instance
    const keyring = new Keyring({ type: 'sr25519' })
    // Some mnemonic phrase
    const PHRASE = '' // wallet mhieu2
    // Add an account, straight mnemonic
    const mhieu2KeyringPair = keyring.addFromUri(PHRASE)
    console.log(mhieu2KeyringPair.address)
    // 5EjfFwY5cA4B5ygf4WT96xLLNXFu4YFrArSCX6BgqasW8VW9

    // Make a transfer from Alice to BOB, waiting for inclusion
    const mhieu1Address = '5D7En1GPDt159tny2drpwiUkqGdYU84e4Mm8GSnis48zNtAw'

    const targetReference = ['75d122c5-f94b-4d86-a41b-38e4bd8e0f52']

    let count = 0
    const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(async (header) => {
      count++
      console.log('ListenTransactionService ~ header:', header.toHuman())
      console.log('ListenTransactionService ~ header:', header.hash.toHuman())

      // const fakeBlockHash =
      //   '0x27db2159d6dcf7985dd6f74b998feb50257d8e02739b3e629662b73db1cdc0f5'

      const signedBlock = await api.rpc.chain.getBlock(header.hash)
      if (signedBlock.isEmpty) console.log('block is empty')
      console.log('tx length:', signedBlock.block.extrinsics.length)

      // Find the extrinsics that include the transfer
      const tx = signedBlock.block.extrinsics.find((ex, index) => {
        // the extrinsics are decoded by the API, human-like view
        console.log(index, ex.toHuman())

        const {
          isSigned,
          method: { args, method, section }
        } = ex

        if (!isSigned) return false
        console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`)
        if (`${section}.${method}` !== 'utility.batch') return false

        const reference: Bytes | undefined = args?.[0]?.[1]?.get('args')?.get('remark')
        if (!reference) return false

        const decoder = new TextDecoder()
        const referenceBase64 = decoder.decode(reference)
        const referenceArray = JSON.parse(Buffer.from(referenceBase64, 'base64').toString('ascii'))
        console.log('ListenTransactionService ~ tx ~ referenceArray:', referenceArray)

        return JSON.stringify(targetReference.sort()) === JSON.stringify(referenceArray.sort())
      })

      /**
       * section.method = utility.batch\
       * exist args?.[0]?.[1]?.get('args')?.get('remark')
       * decode value trên phải bằng reference (compare 2 mảng)
       */

      if (count == 10) {
        console.log('unsubscribe')
        unsubscribe()
      }
    })
  }
}
