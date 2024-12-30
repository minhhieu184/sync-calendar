import { googleAuth } from '@common'
import { Event } from '@microsoft/microsoft-graph-types'
import { GoogleEventService } from '@model/calendar/google-event.service'
import { MSAuthService } from '@model/calendar/ms-auth.service'
import { GaxiosError } from 'gaxios'
import { google } from 'googleapis'

async function main() {
  const client = new MSAuthService().client

  const roomEmail = 'hud.17.traxanh@iceteasoftware.com'
  const events = await getMSEvent(roomEmail)
  console.log('main ~ events:', events[0].attendees)
  // await Promise.allSettled(
  //   events.map(({ id }) => id && deleteMSEvent(roomEmail, id))
  // )

  // const subs = (await client.api('/subscriptions').get())
  //   .value as Subscription[]
  // console.log('main ~ subs:', subs)
  // await Promise.all(
  //   subs.map(({ id }) => id && client.api(`/subscriptions/${id}`).delete())
  // )

  //////////////////////////

  // const googleEventService = new GoogleEventService()
  // const {
  //   data: { items }
  // } = await google.calendar('v3').events.list({
  //   auth: googleAuth(process.env.GOOGLE_BOOKING_EMAIL),
  //   calendarId: 'primary',
  //   maxResults: 100,
  //   timeMin: '2024-12-07T17:00:00.000Z',
  //   timeMax: '2024-12-08T17:00:00.000Z'
  // })
  // console.log('events ~ events:', items)
  // console.log('events ~ events:', items?.length)
  // await Promise.all(
  //   items?.map(
  //     ({ id }) =>
  //       id &&
  //       googleEventService.delete(process.env.GOOGLE_BOOKING_EMAIL || '', id)
  //   ) || []
  // )
}

async function getMSEvent(email: string) {
  return new Promise<Event[]>((resolve, reject) => {
    new MSAuthService().client
      .api(
        // `/users/${email}/calendarview?startdatetime=2024-12-07T17:00:00.000Z&enddatetime=2024-12-08T17:00:00.000Z`
        `/users/${email}/calendarview?startdatetime=2025-01-18T17:00:00.000Z&enddatetime=2025-01-19T17:00:00.000Z`
      )
      .get((err, res) => {
        if (err) return reject(err)
        resolve(res.value)
      })
      .catch()
  })
}

async function deleteMSEvent(email: string, eventId: string) {
  return new Promise((resolve, reject) => {
    new MSAuthService().client
      .api(`/users/${email}/events/${eventId}`)
      .delete((err, res) => {
        if (err) return reject(err)
        resolve(res)
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
