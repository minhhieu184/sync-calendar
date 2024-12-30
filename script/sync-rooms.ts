import { googleAuth } from '@common'
import { EmailAddress } from '@microsoft/microsoft-graph-types'
import { MSAuthService } from '@model/calendar/ms-auth.service'
import { default as DataSource } from '@model/db/data-source'
import { GoogleRoom, MicrosoftRoom } from '@model/db/entity'
import { GaxiosError } from 'gaxios'
import { google } from 'googleapis'

/**
 *
 * This script is used to watch google calendar for all users in the domain
 * It will create a watch channel for each user in the domain
 * It will renew the watch channel if the channel is expired
 */
async function main() {
  await DataSource.initialize()
  await Promise.all([syncGoogleRooms(), syncMicrosoftRooms()])

  // const bookingAuth = googleAuth('its.booking@icetea.io')
  // const { status } = await google.calendar('v3').events.delete({
  //   auth: bookingAuth,
  //   calendarId: 'primary',
  //   eventId: 'poa42183juj86iat2dfafgifc0'
  // })
  // console.log('main ~ status:', status)
  // const { data } = await google.calendar('v3').events.insert({
  //   auth: bookingAuth,
  //   calendarId: 'primary',
  //   requestBody: {
  //     summary: '4 Google I/O 2022',
  //     location: 'HUD-15-Phòng họp Mirai 2 (6)',
  //     description: "A chance to hear more about Google's developer products.",
  //     start: {
  //       dateTime: '2024-12-15T10:30:00+07:00',
  //       timeZone: 'Asia/Ho_Chi_Minh'
  //     },
  //     end: {
  //       dateTime: '2024-12-15T11:30:00+07:00',
  //       timeZone: 'Asia/Ho_Chi_Minh'
  //     },
  //     attendees: [
  //       {
  //         email: 'c_188fjj68tv8liinojuv30l4971t8a@resource.calendar.google.com', // location
  //         resource: true
  //       }
  //     ]
  //   }
  // })
  // console.log('google.calendar ~ data:', data)
}

async function syncGoogleRooms() {
  const googleRoomRepository = DataSource.getRepository(GoogleRoom)

  const adminAuth = googleAuth(process.env.GOOGLE_ADMIN_EMAIL)
  const {
    data: { items }
  } = await google.admin('directory_v1').resources.calendars.list({
    customer: 'my_customer',
    maxResults: 500,
    auth: adminAuth,
    query: 'resourceCategory=CONFERENCE_ROOM'
  })
  if (!items) return

  const googleRooms = items.reduce<GoogleRoom[]>(
    (acc, { resourceName, resourceEmail }) => {
      if (!resourceName || !resourceEmail) return acc
      const room = new GoogleRoom()
      room.name = resourceName
      room.email = resourceEmail
      return [...acc, room]
    },
    []
  )
  await googleRoomRepository.upsert(googleRooms, {
    conflictPaths: { name: true }
  })
}

async function syncMicrosoftRooms() {
  const microsoftRoomRepository = DataSource.getRepository(MicrosoftRoom)
  const microsoftRoomsData = await getMicrosoftRooms()
  const microsoftRooms = microsoftRoomsData.reduce<MicrosoftRoom[]>(
    (acc, { name, address }) => {
      if (!name || !address) return acc
      const room = new MicrosoftRoom()
      room.name = name
      room.email = address
      return [...acc, room]
    },
    []
  )
  await microsoftRoomRepository.upsert(microsoftRooms, {
    conflictPaths: { name: true }
  })
}

function getMicrosoftRooms() {
  return new Promise<EmailAddress[]>((resolve, reject) => {
    const msAuthService = new MSAuthService()
    msAuthService.client
      .api(`/users/hieuptm@iceteasoftware.com/findRooms`)
      .version('beta')
      .get((err, res) => {
        if (err) return reject(err)
        resolve(res.value)
      })
      .catch()
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
