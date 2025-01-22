/** DEPRECATED */

import { googleAuth } from '@common'
import { EmailAddress } from '@microsoft/microsoft-graph-types'
import { MSAuthService } from '@model/calendar/ms-auth.service'
import { default as DataSource } from '@model/db/data-source'
import { GoogleRoom, MicrosoftRoom } from '@model/db/entity'
import { GaxiosError } from 'gaxios'
import { google } from 'googleapis'

async function main() {
  await DataSource.initialize()
  await Promise.all([syncGoogleRooms(), syncMicrosoftRooms()])
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
  console.log('syncGoogleRooms ~ googleRooms:', googleRooms)
  // await googleRoomRepository.upsert(googleRooms, {
  //   conflictPaths: { email: true }
  // })
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
  console.log('syncMicrosoftRooms ~ microsoftRooms:', microsoftRooms)
  // await microsoftRoomRepository.upsert(microsoftRooms, {
  //   conflictPaths: { email: true }
  // })
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
