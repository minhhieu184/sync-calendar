// import { GoogleAuth } from '@model/google/google.service'
import { GoogleRoom, RoomRepository } from '@model/db/entity'
import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { calendar_v3 } from 'googleapis'
import { DataSource, Repository } from 'typeorm'
import { AbstractPolymorphicRepository } from 'typeorm-polymorphic'

@Injectable()
export class TestService {
  constructor(
    @InjectDataSource() private readonly DataSource: DataSource,
    @InjectRepository(GoogleRoom)
    private googleRoomRepository: Repository<GoogleRoom>
  ) {}

  async onModuleInit1() {
    // const googleRoomRepository: GoogleRoomRepository =
    //   AbstractPolymorphicRepository.createRepository(
    //     this.DataSource,
    //     GoogleRoomRepository
    //   )
    const roomRepository: RoomRepository =
      AbstractPolymorphicRepository.createRepository(
        this.DataSource,
        RoomRepository
      )
    const randomName = 'name' + Math.random()
    const randomEmail = 'email' + Math.random()
    const room = await roomRepository.save(
      roomRepository.create({ name: randomName })
    )
    console.log('main ~ room:', room)
    // const googleRoom = googleRoomRepository.create({
    //   name: randomName,
    //   email: randomEmail,
    //   room
    // })
    const googleRoom = new GoogleRoom()
    googleRoom.name = randomName
    googleRoom.email = randomEmail
    googleRoom.room = room
    console.log('main ~ googleRoom:', googleRoom)
    const res = await this.googleRoomRepository.save(googleRoom)
    console.log('main ~ res: ', res)
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
