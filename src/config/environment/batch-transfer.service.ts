import { Injectable } from '@nestjs/common'
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api'

@Injectable()
export class PKDBatchTransferService {
  // chain WESTEND RELAY
  async onModuleInit() {
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
    // const unsub = await api.tx.balances
    //   .transferKeepAlive(mhieu1Address, Math.pow(10, 12)) // 1 WND
    //   .signAndSend(mhieu2KeyringPair, ({ events = [], status, txHash }) => {
    //     console.log(`Current status is ${status.type}`)
    //     if (status.isInBlock) {
    //       console.log(`Transaction included at blockHash ${status.asInBlock}`)
    //     }
    //     if (status.isFinalized) {
    //       console.log(`Transaction included at blockHash ${status.asFinalized}`)
    //       console.log(`Transaction hash ${txHash.toHex()}`)
    //       // Loop through Vec<EventRecord> to display all events
    //       events.forEach(({ phase, event: { data, method, section } }) => {
    //         console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
    //       })
    //       unsub()
    //     }
    //   })

    //!
    // const unsub = await api.tx.utility
    //   .batch([
    //     api.tx.balances.transferKeepAlive(mhieu1Address, Math.pow(10, 12)), // 1 WND
    //     api.tx.system.remark('ITS: mhieu2 transfer to mhieu 1 WND')
    //   ])
    //   .signAndSend(mhieu2KeyringPair, ({ events = [], status, txHash }) => {
    //     console.log(`Current status is ${status.type}`)
    //     if (status.isInBlock) {
    //       console.log(`Transaction included at blockHash ${status.asInBlock}`)
    //     }
    //     if (status.isFinalized) {
    //       console.log(`Transaction included at blockHash ${status.asFinalized}`)
    //       console.log(`Transaction hash ${txHash.toHex()}`)
    //       console.log(
    //         `Westend Subscan: https://westend.subscan.io/extrinsic/${txHash.toHex()}`
    //       )
    //       // Loop through Vec<EventRecord> to display all events
    //       events.forEach(({ phase, event: { data, method, section } }) => {
    //         console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
    //       })
    //       unsub()
    //     }
    //   })

    //!
    // no blockHash is specified, so we retrieve the latest
    const blockHash =
      '0x60037b8caaca45c86edbe1515f80ef1bf9eb89fbc15a292a2e50ebf76deb62ce'
    const exHash =
      '0x8c49b678e35181150cd4e354f98431a8fcdb5c09885a8f1fb0da69826bec1856'
    const signedBlock = await api.rpc.chain.getBlock(blockHash)
    // the information for each of the contained extrinsics
    const myEx = signedBlock.block.extrinsics.find(({ hash }) =>
      hash.eq(exHash)
    )
    if (!myEx) {
      console.log('Unable to find extrinsic')
      return
    }
    const {
      isSigned,
      meta,
      method: { args, method, section }
    } = myEx
    // explicit display of name, args & documentation
    console.log(`${section}.${method}`)
    console.log(args[0].toHuman())

    // console.log(meta.docs.map((d) => d.toString()).join('\n'))
    // // signer/nonce info
    // if (isSigned) {
    //   console.log(
    //     `signer=${myEx.signer.toString()}, nonce=${myEx.nonce.toString()}`
    //   )
    // }

    // signedBlock.block.extrinsics.forEach((ex, index) => {
    //   // the extrinsics are decoded by the API, human-like view
    //   console.log(index, ex.toHuman())
    //   const {
    //     isSigned,
    //     meta,
    //     method: { args, method, section }
    //   } = ex
    //   // explicit display of name, args & documentation
    //   console.log(
    //     `${section}.${method}(${args.map((a) => a.toString()).join(', ')})`
    //   )
    //   console.log(meta.documentation.map((d) => d.toString()).join('\n'))
    //   // signer/nonce info
    //   if (isSigned) {
    //     console.log(
    //       `signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`
    //     )
    //   }
    // })
  }
}
