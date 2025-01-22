import {
  ChangeNotification,
  Event as MSEvent,
  NullableOption
} from '@microsoft/microsoft-graph-types'
import {
  Event,
  GoogleRoom,
  MicrosoftRoom,
  Room,
  RoomEvent,
  Workspace
} from '@model/db/entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  CreateGoogleEventDto,
  GoogleEventService
} from './google-event.service'
import { MicrosoftEventService } from './microsoft-event.service'

@Injectable()
export class MicrosoftWebhookHandler {
  #eventChange: Record<string, string | undefined> = {}
  #db: Record<string, number | undefined> = {}

  constructor(
    private readonly msEventService: MicrosoftEventService,
    private readonly googleEventService: GoogleEventService,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(MicrosoftRoom)
    private microsoftRoomRepository: Repository<MicrosoftRoom>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>
  ) {}

  async handle(endpointEmail: string, notification: ChangeNotification) {
    const { resourceData, id: notificationId } = notification
    const eventData = resourceData as NullableOption<MSEvent> | undefined
    const eventId = eventData?.id
    if (!eventId || !notificationId) return

    this.#eventChange[eventId] = notificationId
    setTimeout(async () => {
      try {
        if (this.#eventChange[eventId] !== notificationId) return
        delete this.#eventChange[eventId]

        const bookingEmail = process.env.GOOGLE_BOOKING_EMAIL
        if (!bookingEmail) return

        const query =
          '$select=id,subject,organizer,attendees,start,end,isCancelled,isDraft'
        let msEvent: MSEvent | null = null
        try {
          msEvent = await this.msEventService.getOne(
            endpointEmail,
            eventId,
            query
          )
        } catch (error) {}
        console.log(
          'MicrosoftWebhookHandler ~ msEvent:',
          endpointEmail,
          msEvent
        )

        const eventInDb = await this.eventRepository.findOne({
          where: { workspace: Workspace.MICROSOFT, workspaceEventId: eventId },
          // withDeleted: true,
          relations: ['roomEvents']
        })

        const organizerMail =
          msEvent?.organizer?.emailAddress?.address ||
          eventData?.organizer?.emailAddress?.address
        if (organizerMail && endpointEmail !== organizerMail) return

        if (!msEvent) {
          if (!eventInDb) return
          await this.eventRepository.softDelete(eventInDb.id)

          const roomEvent = eventInDb.roomEvents.find(
            ({ workspace }) => workspace === Workspace.GOOGLE
          )
          if (!roomEvent) return
          await this.googleEventService.delete(
            bookingEmail,
            roomEvent.workspaceEventId
          )
          return
        }

        // Get google rooms from attendees in microsoft event
        const googleRoomPromises = msEvent.attendees?.reduce<
          Promise<GoogleRoom | null>[]
        >((acc, { type, emailAddress }) => {
          if (type !== 'resource') return acc
          const msRoomEmail = emailAddress?.address
          if (!msRoomEmail) return acc
          return [...acc, this.#getGoogleRoomByMicrosoftEmail(msRoomEmail)]
        }, [])
        if (!googleRoomPromises) return
        const googleRooms = (
          await Promise.all(googleRoomPromises)
        ).filter<GoogleRoom>((room) => room != null)
        if (!googleRooms.length) return

        const createEventDto = new CreateGoogleEventDto(msEvent, googleRooms)
        const updateEventDto = createEventDto

        if (!eventInDb) {
          createEventDto.summary = `[ITS_SYNC] ${createEventDto.summary}`
          createEventDto.description = createEventDto.organizer
          const googleEvent = await this.googleEventService.create(
            bookingEmail,
            createEventDto
          )
          // create event in db
          const event = new Event()
          event.workspace = Workspace.MICROSOFT
          event.workspaceEventId = eventId
          event.summary = googleEvent.summary || ''
          event.description = ''
          event.organizer = createEventDto.organizer
          event.start = createEventDto.start
          event.end = createEventDto.end
          const roomEvent = new RoomEvent()
          console.log('create roomEvent:', roomEvent)
          roomEvent.event = event
          roomEvent.workspace = Workspace.GOOGLE
          roomEvent.workspaceEventId = googleEvent.id || ''
          roomEvent.roomEmails = createEventDto.rooms.map((room) => room.email)
          event.roomEvents = [roomEvent]
          await this.eventRepository.save(event)
          return
        }

        // maybe update
        const isTimeChanged =
          updateEventDto.start.getTime() !== eventInDb.start.getTime() ||
          updateEventDto.end.getTime() !== eventInDb.end.getTime()
        const roomEvent = eventInDb.roomEvents.find(
          ({ workspace }) => workspace === Workspace.GOOGLE
        )
        if (!roomEvent) return
        const isRoomChanged =
          JSON.stringify(roomEvent.roomEmails.sort()) !==
          JSON.stringify(googleRooms.map(({ email }) => email).sort())

        const isNeedToUpdate = isTimeChanged || isRoomChanged
        if (!isNeedToUpdate) return

        updateEventDto.summary = `[ITS_SYNC] ${updateEventDto.summary}`
        updateEventDto.description = updateEventDto.organizer
        await this.googleEventService.update(
          bookingEmail,
          roomEvent.workspaceEventId,
          updateEventDto
        )
        eventInDb.start = updateEventDto.start
        eventInDb.end = updateEventDto.end
        roomEvent.roomEmails = googleRooms.map((room) => room.email)
        await this.eventRepository.save(eventInDb)
      } catch (error) {
        console.error('MicrosoftWebhookHandler ~ handler ~ error:', error)
      }
    }, 5000)
  }

  async #getGoogleRoomByMicrosoftEmail(
    email: string
  ): Promise<GoogleRoom | null> {
    const msRoom = await this.microsoftRoomRepository.findOne({
      where: { email }
    })
    if (!msRoom) return null
    const room = await this.roomRepository.findOne({
      where: { id: msRoom.entityId }
    })
    if (!room) return null
    return (
      room.rooms.find((workspaceRoom) => workspaceRoom instanceof GoogleRoom) ||
      null
    )
  }
}
