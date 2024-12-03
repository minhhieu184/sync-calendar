// import { GoogleAuth } from '@model/google/google.service'
import { Injectable } from '@nestjs/common'
import { calendar_v3, google } from 'googleapis'

@Injectable()
export class TestService {
  // constructor(private readonly googleAuth: GoogleAuth) {}

  async onModuleInit1() {
    // get all event in calendar
    console.log(123)

    // google.options({ auth: 'AIzaSyA-_tD3oRUZ0vjxwdWatS7VcLEM0QY3CGE' })
    // const calendar = google.calendar('v3')
    // const ss = await google.calendar('v3').calendarList.list()
    // console.log('TestService ~ onModuleInit ~ ss:', ss)

    // const auth = new google.auth.JWT({
    //   subject: 'hieu.pham1@icetea.io',
    //   // keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    //   scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    // })

    const auth = new google.auth.GoogleAuth({
      // keyFile: 'credentials.json',
      clientOptions: { subject: 'hieu.pham1@icetea.io' },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    })
    google.options({ auth })
    const calendar = google.calendar('v3')

    // await this.removeChannel(calendar, 'rgWTXZdT9XrruVSe1k-VA06n6eM')
    await this.createChannel(calendar)
  }

  createChannel(calendar: calendar_v3.Calendar) {
    return calendar.events.watch({
      calendarId: 'hieu.pham1@icetea.io',
      requestBody: {
        id: 'SyncCalendarIceTea',
        type: 'web_hook',
        address:
          'https://a6e4-27-72-88-206.ngrok-free.app/api/v1/webhook/google',
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
}
