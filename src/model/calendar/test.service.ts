// import { GoogleAuth } from '@model/google/google.service'
import { Injectable } from '@nestjs/common'
import { calendar_v3, google } from 'googleapis'

@Injectable()
export class TestService {
  // constructor(private readonly googleAuth: GoogleAuth) {}

  async onModuleInit1() {
    const auth = new google.auth.GoogleAuth({
      // keyFile: 'credentials.json',
      clientOptions: { subject: 'hieu.pham1@icetea.io' },
      scopes: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events'
      ]
    })
    google.options({ auth })
    const calendar = google.calendar('v3')

    // await this.removeChannel(calendar, 'rgWTXZdT9XrruVSe1k-VA06n6eM')
    // await this.createChannel(calendar)

    const events = await calendar.events.list({
      calendarId: 'primary'
      // maxResults: 10,
      // singleEvents: true,
      // orderBy: 'startTime',
      // pageToken:
      //   'CkAKMAouCgwIka-_ugYQwLvZsAISHgocChoxa2xkcW91M21vMGZ1Y3Y3NGloczViZ2lrZRoMCJGvv7oGEMC72bACwD4B',
      // syncToken: 'CJjE6JKGkIoDEJjE6JKGkIoDGAUggtmOzgIogtmOzgI='
    })
    // console.log(
    //   'TestService ~ onModuleInit1 ~ events: ',
    //   events.data.items?.length
    // )
    // console.log('nextPageToken: ', events.data.nextPageToken)
    // console.log('nextSyncToken: ', events.data.nextSyncToken)
    // console.log(
    //   events.data.items?.map((item) => ({
    //     id: item.id,
    //     status: item.status,
    //     members: item.attendees?.map((attendee) => attendee.email)
    //   }))
    // )
    console.log(events.data.items?.[0])
    console.log(events.data.items?.[1])

    // const ss = events.data.items?.filter(
    //   (item) => item.summary === '[ITS] BUSINESS MANNER'
    // )
    // const e = ss?.[0]!
    // console.log('xxxx', e)
    // console.log('xxxxx', events.data.items?.[events.data.items.length - 1])

    // const xxc = await this.createEvent(calendar)
    // console.log('TestService ~ onModuleInit ~ xxc:', xxc)
    // const ee = await calendar.events.get({
    //   eventId: xxc.id!,
    //   calendarId: 'primary'
    // })
    // console.log('TestService ~ onModuleInit1 ~ ee:', ee.data)
  }

  createChannel(calendar: calendar_v3.Calendar) {
    return calendar.events.watch({
      calendarId: 'primary',
      requestBody: {
        id: 'SyncCalendarIceTea',
        type: 'web_hook',
        address:
          'https://93d2-27-72-88-206.ngrok-free.app/api/v1/webhook/google',
        expiration: '1735529795000'
      }
    })
  }

  removeChannel(calendar: calendar_v3.Calendar, resourceId: string) {
    return calendar.channels.stop({
      requestBody: {
        id: 'SyncCalendarIceTea',
        resourceId
      }
    })
  }

  async createEvent(calendar: calendar_v3.Calendar) {
    const { data } = await calendar.events.insert({
      calendarId: 'primary', // nil
      requestBody: {
        summary: '4 Google I/O 2022', // subject
        location: 'HUD-15-Phòng họp Mirai 2 (6)', // nil
        description: "A chance to hear more about Google's developer products.", //body
        start: {
          // start
          dateTime: '2024-12-15T10:30:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh'
        },
        end: {
          // end
          dateTime: '2024-12-15T11:30:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh'
        },
        // recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
        attendees: [
          //attendees: contain room
          { email: 'hieu.pham1@icetea.io' },
          { email: 'tung.cong@icetea.io' },
          {
            email:
              'c_18826djmihdiagcuit1ns3ditlqhc@resource.calendar.google.com', // location
            resource: true
          }
        ],
        creator: { email: 'hieu.pham1@icetea.io' }, // nil
        organizer: { email: 'hieu.pham1@icetea.io' } // organizer
      }
    })
    return data
  }
}
