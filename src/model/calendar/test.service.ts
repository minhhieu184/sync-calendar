// import { GoogleAuth } from '@model/google/google.service'
import { Injectable } from '@nestjs/common'
import { calendar_v3, google } from 'googleapis'

@Injectable()
export class TestService {
  // constructor(private readonly googleAuth: GoogleAuth) {}

  async onModuleInit1() {
    // const calendar = googleCalendar('tung.cong@icetea.io')

    const auth = new google.auth.GoogleAuth({
      clientOptions: { subject: '' },
      scopes: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/admin.directory.user.readonly'
      ]
    })
    google.options({ auth })
    const {
      data: { users }
    } = await google.admin('directory_v1').users.list({ domain: 'icetea.io' })
    console.log('TestService ~ onModuleInit ~ user:', users?.length)
    console.log('TestService ~ onModuleInit ~ user:', users?.[20])
    // const user2 = await google
    //   .admin('directory_v1')
    //   .users.get({ userKey: 'tung.cong@icetea.io' })
    // console.log('TestService ~ onModuleInit ~  user2:', user2.data)

    // await this.removeChannel(calendar, 'rgWTXZdT9XrruVSe1k-VA06n6eM')
    // await this.createChannel(calendar)

    // const events = await calendar.events.list({
    //   calendarId: 'primary'
    //   // maxResults: 10,
    //   // singleEvents: true,
    //   // orderBy: 'startTime',
    //   // pageToken:
    //   //   'CkAKMAouCgwIka-_ugYQwLvZsAISHgocChoxa2xkcW91M21vMGZ1Y3Y3NGloczViZ2lrZRoMCJGvv7oGEMC72bACwD4B',
    //   // syncToken: 'CJjE6JKGkIoDEJjE6JKGkIoDGAUggtmOzgIogtmOzgI='
    // })
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
    // console.log(events.data.items?.[0])
    // console.log(events.data.items?.[1])

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
          'https://e8b1-27-72-88-206.ngrok-free.app/api/v1/webhook/google',
        expiration: '1924915750000'
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
