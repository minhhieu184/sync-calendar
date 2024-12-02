import { GoogleAuth } from '@model/google/google.service'
import { Injectable } from '@nestjs/common'
import { google } from 'googleapis'

@Injectable()
export class TestService {
  constructor(private readonly googleAuth: GoogleAuth) {}

  async onModuleInit() {
    // get all event in calendar
    console.log(123)
    const sdf = this.googleAuth.jsonContent
    console.log('TestService ~ onModuleInit ~ sdf:', sdf)

    const calendar = google.calendar('v3')
    const ss = await calendar.calendars.get({
      calendarId: 'primary',
      auth: this.googleAuth
    })
    console.log('TestService ~ onModuleInit ~ ss:', ss)
    // const ss = await calendar.events.list({calendarId: ''})
    // console.log('TestService ~ onModuleInit ~ ss:', ss)
  }
}
