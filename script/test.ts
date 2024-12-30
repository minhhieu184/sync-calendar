import { Client } from '@microsoft/microsoft-graph-client'
import { Subscription } from '@microsoft/microsoft-graph-types'
import { MSAuthService } from '@model/calendar/ms-auth.service'
import { default as DataSource } from '@model/db/data-source'
import { Event, RoomEvent } from '@model/db/entity'
import { GaxiosError } from 'gaxios'
import { noop } from 'rxjs'
import { IsNull } from 'typeorm'

/**
 *
 * This script is used to watch google calendar for all users in the domain
 * It will create a watch channel for each user in the domain
 * It will renew the watch channel if the channel is expired
 */
async function main() {
  await DataSource.initialize()
  const eventRepository = DataSource.getRepository(Event)
  const roomEventRepository = DataSource.getRepository(RoomEvent)

  const msauth = new MSAuthService()
  const client = msauth.client

  // const subscriptions = await listSubscription(client)
  // console.log('main ~ subscriptions:', subscriptions)
  // // remove all exept the last one
  // await Promise.all(
  //   subscriptions
  //     // .slice(0, -1)
  //     .map((sub) => deleteSubscription(client, sub.id || ''))
  // )

  ///////////////////////
  const sdf = IsNull()
  console.log('main ~ sdf:', sdf)
}

async function listSubscription(client: Client) {
  return new Promise<Subscription[]>((resolve, reject) => {
    client
      .api('/subscriptions')
      .get((err, res) => {
        if (err) return reject(err)
        resolve(res.value)
      })
      .catch(noop)
  })
}

async function deleteSubscription(client: Client, id: string) {
  return new Promise((resolve, reject) => {
    client
      .api('/subscriptions/' + id)
      .del((err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
      .catch(noop)
  })
}

main()
  .catch((e) => {
    if (e instanceof GaxiosError) {
      console.log('❌ GaxiosError:', e.response?.data.error)
      console.log(e.stack)
      return
    }
    console.error('❌ Failed to run the script:', e)
  })
  .finally(() => process.exit(0))
