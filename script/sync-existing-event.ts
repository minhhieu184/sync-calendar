import { googleAuth } from '@common'
import { CreateMicrosoftEventDto } from '@model/calendar/microsoft-event.service'
import { default as DataSource } from '@model/db/data-source'
import { Event, GoogleRoom, Workspace } from '@model/db/entity'
import { GaxiosError } from 'gaxios'
import { google } from 'googleapis'
import { getAllEmailsInWorkspace } from './watch-google-calendar'

async function main() {
  await DataSource.initialize()
  const googleRoomRepository = DataSource.getRepository(GoogleRoom)
  const eventRepository = DataSource.getRepository(Event)
  const calendar = google.calendar('v3')

  const emails = await getAllEmailsInWorkspace()
  console.log('main ~ emails:', emails)

  const email = emails[0]

  const {
    data: { items: events }
  } = await calendar.events.list({
    auth: googleAuth(email),
    calendarId: 'primary',
    maxResults: 10,
    timeMin: new Date().toISOString()
  })
  console.log('main ~ events:', events)
  if (!events) return

  const googleEvent = events[0]

  if (!googleEvent.id) return
  // chưa có trong db => create trong db và ms event
  const isExistInDb = await eventRepository.exists({
    where: { workspaceEventId: googleEvent.id }
  })
  if (!isExistInDb) {
    const createEventDto = new CreateMicrosoftEventDto(
      googleEvent,
      microsoftRooms
    )
    createEventDto.summary = `[ITS_SYNC] ${createEventDto.summary}`
    createEventDto.description = createEventDto.organizer
    const msEvent = await this.msEventService.create(
      microsoftRooms[0].email,
      createEventDto
    )
    console.log('create event in db and ms event')
    const event = new Event()
    event.workspace = Workspace.GOOGLE
    event.workspaceEventId = googleEvent.id || ''
    event.summary = createEventDto.summary
    event.description = createEventDto.description
    event.organizer = createEventDto.organizer
    event.start = createEventDto.start
    event.end = createEventDto.end
    const roomEvent = new RoomEvent()
    console.log('create roomEvent:', roomEvent)
    roomEvent.event = event
    roomEvent.workspace = Workspace.MICROSOFT
    roomEvent.workspaceEventId = msEvent.id || ''
    roomEvent.roomEmails = createEventDto.rooms.map((room) => room.email)
    event.roomEvents = [roomEvent]
    await eventRepository.save(event)
  }

  // đã có trong db
  //    => có update không
  //    => có restore không

  // event có trong db nhưng không có trong google calendar => delete trong db và ms event

  // weekly event, daily event thì ntn
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
