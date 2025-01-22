import { Client } from '@microsoft/microsoft-graph-client'
import { Subscription } from '@microsoft/microsoft-graph-types'
import { default as DataSource } from '@model/db/data-source'
import {
  Event,
  GoogleRoomRepository,
  MicrosoftRoom,
  RoomEvent,
  RoomRepository
} from '@model/db/entity'
import { GaxiosError } from 'gaxios'
import { noop } from 'rxjs'
import { AbstractPolymorphicRepository } from 'typeorm-polymorphic'

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

  const googleRoomRepository: GoogleRoomRepository =
    AbstractPolymorphicRepository.createRepository(
      DataSource,
      GoogleRoomRepository
    )
  const roomRepository: RoomRepository =
    AbstractPolymorphicRepository.createRepository(DataSource, RoomRepository)
  // const room = await roomRepository.save(
  //   roomRepository.create({ name: 'room' })
  // )

  // const email = 'c_188c3b1vutsd6ilgm07i10026sg84@resource.calendar.google.com'
  const email = 'c_18803s0g6f9gogf6mm5avs3tp5tlm@resource.calendar.google.com'
  const googleRoom = await googleRoomRepository.findOne({
    where: { email }
  })
  console.log('main ~ googleRoom:', googleRoom)
  if (!googleRoom) return null
  let room = await roomRepository.findOne({
    where: { id: googleRoom.entityId }
  })
  console.log('main ~ room:', room)
  if (!room) return null
  const microsoftRoom = room.rooms.find(
    (workspaceRoom) => workspaceRoom instanceof MicrosoftRoom
  )
  console.log('main ~ microsoftRoom:', microsoftRoom)
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
