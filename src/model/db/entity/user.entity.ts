import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  // export default class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  gmail?: string

  @Column({ nullable: true })
  outlook?: string
}

/**

Event
id
calendar_id
origin_workspace_id

summary
location
description
start
end
attendees
creator
organizer
is_deleted


có cần trường deleted_at không?
target: dễ dàng thêm workspace mới vào


ROOM
id
name

GOOGLE_ROOM
id
room_id
name
email

MS_ROOM
id
room_id
name
email

GOOGLE_LOCATION / MS_LOCATION
id
location_id : 1 - 1 mandatory
workspace_location_id
email

GOOGLE CHANNEL
id
email
channel_id
resource_id
sync_token
expired_at



script sync location




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

 */
