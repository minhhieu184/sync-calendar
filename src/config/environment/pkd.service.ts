import { Injectable } from '@nestjs/common'
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api'
import '@polkadot/api-augment'
import '@polkadot/rpc-augment'
import '@polkadot/types-augment'
import BN from 'bn.js'
@Injectable()
export class PKDService {
  async onModuleInit1() {
    // Construct
    const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io')
    // const wsProvider = new WsProvider('wss://sys.ibp.network/asset-hub-westend')
    const api = await ApiPromise.create({ provider: wsProvider })

    // // Do something
    // console.log(api.genesisHash.toHex())

    // // The length of an epoch (session) in Babe
    // console.log(api.consts.babe.epochDuration.toNumber())
    // // The amount required to create a new account
    // console.log(api.consts.balances.existentialDeposit.toNumber())
    // // The amount required per byte on an extrinsic
    // console.log(
    //   api.consts.transactionPayment.operationalFeeMultiplier.toNumber()
    // )

    //
    // The actual address that we will use
    const ADDR = '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE'

    // // Retrieve the last timestamp
    // const now = await api.query.timestamp.now();
    // // Retrieve the account balance & nonce via the system module
    // const { nonce, data: balance } = await api.query.system.account(ADDR);

    // Retrieve last block timestamp, account nonce & balances
    // const [now, { nonce, data: balance }] = await Promise.all([
    //   api.query.timestamp.now(),
    //   api.query.system.account(ADDR)
    // ])
    // console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`)

    // //
    // // Retrieve the chain name
    // const chain = await api.rpc.system.chain()
    // // Retrieve the latest header
    // const lastHeader = await api.rpc.chain.getHeader()
    // // Log the information
    // console.log(
    //   `${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
    // )

    // let count = 0
    // Subscribe to the new headers
    // const unSubHeads = await api.rpc.chain.subscribeNewHeads((lastHeader) => {
    //   console.log(
    //     `${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
    //   )
    //   if (++count === 10) {
    //     unSubHeads()
    //   }
    // })

    // const unsub = await api.derive.chain.subscribeNewHeads((lastHeader) => {
    //   console.log(`#${lastHeader.number} was authored by ${lastHeader.author}`)
    // })

    //!
    // Retrieve the current timestamp via subscription
    // const unsub = await api.query.timestamp.now((moment) => {
    //   console.log(`The last block has a timestamp of ${moment}`)
    // })
    // Subscribe to balance changes for our account
    // const unsub = await api.query.system.account(
    //   ADDR,
    //   ({ nonce, data: balance }) => {
    //     console.log(
    //       `free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`
    //     )
    //   }
    // )

    //!
    // Multi queries
    // const unsub = await api.query.system.account.multi(
    //   [ADDR1, ADDR2],
    //   (balances) => {
    //     const [{ data: balance1 }, { data: balance2 }] = balances
    //     console.log(`The balances are ${balance1.free} and ${balance2.free}`)
    //   }
    // )

    // // Retrieve a snapshot of the validators
    // // (all active & waiting based on ValidatorPrefs storage)
    // const validatorKeys = await api.query.staking.validators.keys()
    // console.log('PKDService ~ onModuleInit ~ validatorKeys:', validatorKeys)
    // // Subscribe to the balances for these accounts
    // const unsub = await api.query.system.account.multi(
    //   validatorKeys,
    //   (accounts) => {
    //     console.log(
    //       `The nonce and free balances are: ${accounts.map(({ nonce, data: { free } }) => [nonce, free])}`
    //     )
    //   }
    // )

    // Subscribe to the timestamp, our index and balance
    // const unsub = await api.queryMulti(
    //   [api.query.timestamp.now],
    //   ([now, { nonce, data: balance }]) => {
    //     console.log(
    //       `${now}: balance of ${balance.free} and a nonce of ${nonce}`
    //     )
    //   }
    // )

    //!
    // // Retrieve the current block header
    // const lastHdr = await api.rpc.chain.getHeader()
    // // Get a decorated api instance at a specific block
    // const apiAt = await api.at(lastHdr.hash)
    // // query the balance at this point of the chain
    // const {
    //   data: { free }
    // } = await apiAt.query.system.account(ADDR)
    // // Display the free balance
    // console.log(`The current free is ${free.toString()}`)

    // //
    // // Retrieve the active era
    // const activeEra = await api.query.staking.activeEra()
    // // retrieve all exposures for the active era
    // const exposures = await api.query.staking.erasStakers.entries(
    //   activeEra.unwrap().index
    // )
    // exposures.forEach(([key, exposure]) => {
    //   console.log(
    //     'key arguments:',
    //     key.args.map((k) => k.toHuman())
    //   )
    //   console.log('exposure:', exposure.toHuman())
    // })

    // // retrieve all the nominator keys
    // const keys = await api.query.staking.nominators.keys()
    // // extract the first key argument [AccountId] as string
    // const nominatorIds = keys.map(({ args: [nominatorId] }) => nominatorId)
    // console.log('all nominators:', nominatorIds.join(', '))

    // // Retrieve the hash & size of the entry as stored on-chain
    // const [entryHash, entrySize] = await Promise.all([
    //   api.query.system.account.hash(ADDR),
    //   api.query.system.account.size(ADDR)
    // ])
    // // Output the info
    // console.log(
    //   `The current size is ${entrySize} bytes with a hash of ${entryHash}`
    // )

    // // Extract the info
    // const { meta, method, section } = api.query.system.account.creator

    // // Display some info on a specific entry
    // console.log(`${section}.${method}: ${meta.docs.join(' ')}`)
    // console.log(`query key: ${api.query.system.account.key(ADDR)}`)

    //!
    // Create a keyring instance
    const keyring = new Keyring({ type: 'sr25519' })
    // Some mnemonic phrase
    // const PHRASE =
    //   'entire material egg meadow latin bargain dutch coral blood melt acoustic thought'
    // // Add an account, straight mnemonic
    // const newPair = keyring.addFromUri(PHRASE)
    // // (Advanced) add an account with a derivation path (hard & soft)
    // const newDeri = keyring.addFromUri(`${PHRASE}//hard-derived/soft-derived`)
    // // (Advanced, development-only) add with an implied dev seed and hard derivation
    // const alice = keyring.addFromUri('//Alice', { name: 'Alice default' })
    // // add a hex seed, 32-characters in length
    // const hexPair = keyring.addFromUri(
    //   '0x1234567890123456789012345678901234567890123456789012345678901234'
    // )
    // // add a string seed, internally this is padded with ' ' to 32-bytes in length
    // const strPair = keyring.addFromUri('Janice')

    // // Add our Alice dev account
    // const alice = keyring.addFromUri('//Alice', { name: 'Alice default' })
    // // Log some info
    // console.log(
    //   `${alice.meta.name}: has address ${alice.address} with publicKey [${alice.publicKey.toString()}]`
    // )

    // // Convert message, sign and then verify
    // const message = stringToU8a('this is our message')
    // const signature = alice.sign(message)
    // const isValid = alice.verify(message, signature, alice.publicKey)
    // // Log info
    // console.log(
    //   `The signature ${u8aToHex(signature)}, is ${isValid ? '' : 'in'}valid`
    // )

    // const pairs = keyring.getPairs()
    // console.log('PKDService ~ onModuleInit ~ pairs:', pairs)

    //!
    // Create alice (carry-over from the keyring section)
    const alice = keyring.addFromUri('//Alice')
    const bob = keyring.addFromUri('//Bob')

    // // Make a transfer from Alice to BOB, waiting for inclusion
    // const unsub = await api.tx.balances
    //   .transferKeepAlive(bob.address, 12345)
    //   .signAndSend(alice, (result) => {
    //     console.log(`Current status is ${result.status}`)
    //     if (result.status.isInBlock) {
    //       console.log(
    //         `Transaction included at blockHash ${result.status.asInBlock}`
    //       )
    //     } else if (result.status.isFinalized) {
    //       console.log(
    //         `Transaction finalized at blockHash ${result.status.asFinalized}`
    //       )
    //       unsub()
    //     }
    //   })

    // Make a transfer from Alice to BOB, waiting for inclusion
    // const unsub = await api.tx.balances
    //   .transferKeepAlive(bob.address, 123)
    //   .signAndSend(alice, ({ events = [], status, txHash }) => {
    //     console.log(`Current status is ${status.type}`)
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
    // check asset
    // const asset = await api.query.assets.asset('50000052')
    // console.log('PKDService ~ onModuleInit ~ asset:', asset.toHuman())
    // const asset2 = await api.query.assets.asset('50000059')
    // console.log('PKDService ~ onModuleInit ~ asset2:', asset2.toHuman())
    // console.log('PKDService ~ onModuleInit ~ asset2:', asset2.isEmpty)
    // console.log('PKDService ~ onModuleInit ~ asset2:', asset2.value.status)

    // const dvsd = await api.query.assets.account(
    //   '50000052',
    //   '5D7En1GPDt159tny2drpwiUkqGdYU84e4Mm8GSnis48zNtAw'
    // )
    // console.log('PKDService ~ onModuleInit ~ dvsd:', dvsd.toHuman())

    //!
    // check ex
    /**
     *
     * 1: check signature xxxxxxxxxxxxxxxxxxx
     * 2: postAmount.minus(preAmount).lt(amount) xxxxxxxxxxxxxxxxxxx
     * 3: correct recipient YYYYYYYYYYYYYY
     * 4: check transaction success and (2) by event
     *
     */
    const blockHash = '0x27db2159d6dcf7985dd6f74b998feb50257d8e02739b3e629662b73db1cdc0f5'
    const exHash = '0xa8e8edfeddeb97e330857983762cb418177a75c03211194391b730c562cb5dfc'
    const targetRecipient = '5D7En1GPDt159tny2drpwiUkqGdYU84e4Mm8GSnis48zNtAw'
    const targetAmount = new BN(1000000000000)

    const block = await api.rpc.chain.getBlock(blockHash)
    console.log('PKDService ~ onModuleInit ~ block:', block.toHuman())
    const exIndex = block.block.extrinsics.findIndex((ex) => ex.hash.toString() === exHash)
    console.log('PKDService ~ onModuleInit ~ exIndex:', exIndex)
    if (exIndex === -1) {
      console.log('Cannot find the extrinsic')
      return
    }
    const ex = block.block.extrinsics[exIndex]
    console.log('PKDService ~ onModuleInit ~ ex:', ex.toHuman())
    const {
      isSigned,
      method: { args, method, section }
    } = ex

    if (!isSigned) return false
    if (`${section}.${method}` !== 'utility.batch') return false

    // 3
    const recipient: string | undefined = args?.[0]?.[0]?.get('args')?.get('dest')?.toJSON().id
    console.log('PKDService ~ onModuleInit ~ recipient:', recipient)
    console.log('IS correct recipient:', recipient === targetRecipient)

    // 4
    const apiAt = await api.at(blockHash)
    const allRecords = await apiAt.query.system.events()
    const records = allRecords.filter(
      ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(exIndex)
    )

    const isExtrinsicSuccess = records.some(({ event }) =>
      api.events.system.ExtrinsicSuccess.is(event)
    )
    console.log('isExtrinsicSuccess:', isExtrinsicSuccess)

    const amount: string | undefined = args?.[0]?.[0]?.get('args')?.get('value')?.toString()
    if (!amount) return false
    const isAmountCorrect = targetAmount.eq(new BN(amount))
    console.log('PKDService ~ onModuleInit ~ isAmountCorrect:', isAmountCorrect)
  }
}
