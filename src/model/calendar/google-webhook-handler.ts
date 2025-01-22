import {
  Event,
  GoogleEventChannel,
  GoogleRoom,
  MicrosoftRoom,
  Room,
  RoomEvent,
  Workspace
} from '@model/db/entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { calendar_v3 } from 'googleapis'
import { In, Repository } from 'typeorm'
import {
  CreateMicrosoftEventDto,
  MicrosoftEventService
} from './microsoft-event.service'

@Injectable()
export class GoogleWebhookHandler {
  constructor(
    private readonly msEventService: MicrosoftEventService,
    @InjectRepository(GoogleEventChannel)
    private eventChannelRepository: Repository<GoogleEventChannel>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(MicrosoftRoom)
    private microsoftRoomRepository: Repository<MicrosoftRoom>,
    @InjectRepository(GoogleRoom)
    private googleRoomRepository: Repository<GoogleRoom>,
    @InjectRepository(RoomEvent)
    private roomEventRepository: Repository<RoomEvent>
  ) {}

  async handle(endpointEmail: string, googleEvent: calendar_v3.Schema$Event) {
    const workspaceEventId = googleEvent.id
    if (!workspaceEventId) return

    const eventInDb = await this.eventRepository.findOne({
      where: { workspaceEventId },
      withDeleted: true,
      relations: ['roomEvents']
    })
    console.log('Webhook ~ eventInDb:', eventInDb)

    const isEmptyEvent = !googleEvent.htmlLink
    console.log('Webhook ~ isEmptyEvent:', isEmptyEvent)
    if (isEmptyEvent) {
      if (!eventInDb) return
      console.log('event In Db')
      const roomEvent = eventInDb.roomEvents.find(
        ({ workspace }) => workspace === Workspace.MICROSOFT
      )
      console.log('Webhook ~ roomEvent:', roomEvent)
      if (!roomEvent) return
      try {
        await this.msEventService.delete(
          roomEvent.roomEmails[0],
          roomEvent.workspaceEventId
        )
      } catch (e) {
        console.error('Failed to delete MS event:', e)
      }
      try {
        await this.eventRepository.softDelete(eventInDb.id)
      } catch (e) {
        console.error('Failed to soft delete event in DB:', e)
      }
      return
    }

    if (googleEvent.creator?.email !== endpointEmail) return

    if (eventInDb) {
      console.log('event In Db 2')
      if (eventInDb.deletedAt) {
        await this.#restoreAndCreateMSEvent(eventInDb, googleEvent)
      } else {
        await this.updateEventInDb(eventInDb, googleEvent)
      }
    } else {
      await this.createEvent(googleEvent)
    }
  }

  async #restoreAndCreateMSEvent(
    eventInDb: Event,
    item: calendar_v3.Schema$Event
  ) {
    await this.eventRepository.restore(eventInDb.id)

    // create 1 event in MS with room mail
    const roomEvent = eventInDb.roomEvents.find(
      ({ workspace }) => workspace === Workspace.MICROSOFT
    )
    console.log('un detele ~ roomEvent:', roomEvent)
    if (!roomEvent) return
    const microsoftRooms = await this.microsoftRoomRepository.find({
      where: { email: In(roomEvent.roomEmails) }
    })
    const createEventDto = new CreateMicrosoftEventDto(item, microsoftRooms)
    createEventDto.summary = `[ITS_SYNC] ${createEventDto.summary}`
    createEventDto.description = createEventDto.organizer
    const msEvent = await this.msEventService.create(
      roomEvent.roomEmails[0],
      createEventDto
    )
    console.log('recreate ms event', msEvent.id)

    // update workspaceEventId của room event in DB
    await this.roomEventRepository.update(
      { id: roomEvent.id },
      { workspaceEventId: msEvent.id || '' }
    )
  }

  private async updateEventInDb(
    eventInDb: Event,
    item: calendar_v3.Schema$Event
  ) {
    let isNeedToUpdate = false
    const oldStart = eventInDb.start.getTime()
    const oldEnd = eventInDb.end.getTime()

    const microsoftRoomPromises = item.attendees?.reduce<
      Promise<MicrosoftRoom | null>[]
    >((acc, { email, resource }) => {
      if (!email?.endsWith('@resource.calendar.google.com')) return acc
      if (!resource) return acc
      return [...acc, this.#getMicrosoftRoomByGoogleEmail(email)]
    }, [])
    if (!microsoftRoomPromises) return
    const microsoftRooms = (
      await Promise.all(microsoftRoomPromises)
    ).filter<MicrosoftRoom>((room) => room != null)
    if (!microsoftRooms.length) return

    const createEventDto = new CreateMicrosoftEventDto(item, microsoftRooms)
    createEventDto.summary = `[ITS_SYNC] ${createEventDto.summary}`
    createEventDto.description = createEventDto.organizer
    const updateEventDto = createEventDto
    const newStart = updateEventDto.start.getTime()
    const newEnd = updateEventDto.end.getTime()
    if (oldStart !== newStart || oldEnd !== newEnd) isNeedToUpdate = true
    console.log('time ~ isNeedToUpdate:', isNeedToUpdate)

    const roomEvent = eventInDb.roomEvents.find(
      ({ workspace }) => workspace === Workspace.MICROSOFT
    )
    if (!roomEvent) return
    const isRoomChanged =
      JSON.stringify(microsoftRooms.map(({ email }) => email).sort()) !==
      JSON.stringify([...roomEvent.roomEmails].sort())
    if (isRoomChanged) isNeedToUpdate = true
    console.log('room ~ isNeedToUpdate:', isNeedToUpdate)

    if (!isNeedToUpdate) return

    const roomMailUsedToCreateEvent = roomEvent.roomEmails[0]
    const roomMailUsedToCreateEventIndex = microsoftRooms.findIndex(
      (room) => room.email === roomMailUsedToCreateEvent
    )
    const isRoomMailUsedToCreateEventExist =
      roomMailUsedToCreateEventIndex !== -1

    if (!microsoftRooms.length) {
      // delete event because no room
      await Promise.allSettled([
        await this.msEventService.delete(
          roomEvent.roomEmails[0],
          roomEvent.workspaceEventId
        ),
        await this.eventRepository.softDelete(eventInDb.id)
      ])
      return
    }

    if (!isRoomMailUsedToCreateEventExist) {
      await this.#handleNonExistentRoomMail(
        roomEvent,
        microsoftRooms[0].email,
        createEventDto
      )
      return
    }

    const roomEmails = [
      microsoftRooms[roomMailUsedToCreateEventIndex].email,
      ...microsoftRooms
        .filter((_, index) => index !== roomMailUsedToCreateEventIndex)
        .map((room) => room.email)
    ]

    await this.msEventService.update(
      roomEmails[0],
      roomEvent.workspaceEventId,
      updateEventDto
    )
    await this.eventRepository.update(
      { id: eventInDb.id },
      { start: updateEventDto.start, end: updateEventDto.end }
    )
    await this.roomEventRepository.update({ id: roomEvent.id }, { roomEmails })
  }

  async #handleNonExistentRoomMail(
    roomEvent: RoomEvent,
    microsoftRoomEmail: string,
    createEventDto: CreateMicrosoftEventDto
  ) {
    try {
      await this.msEventService.delete(
        roomEvent.roomEmails[0],
        roomEvent.workspaceEventId
      )
    } catch (e: any) {
      console.error('Failed to delete MS event:', e.message)
    }
    const msEvent = await this.msEventService.create(
      microsoftRoomEmail,
      createEventDto
    )
    await this.roomEventRepository.update(
      { id: roomEvent.id },
      {
        workspaceEventId: msEvent.id,
        roomEmails: createEventDto.rooms.map((room) => room.email)
      }
    )
  }

  async createEvent(googleEvent: calendar_v3.Schema$Event) {
    console.log('event not In Db => create event')
    const microsoftRoomPromises = googleEvent.attendees?.reduce<
      Promise<MicrosoftRoom | null>[]
    >((acc, { email, resource }) => {
      if (!email?.endsWith('@resource.calendar.google.com')) return acc
      if (!resource) return acc
      return [...acc, this.#getMicrosoftRoomByGoogleEmail(email)]
    }, [])
    if (!microsoftRoomPromises) return
    const microsoftRooms = (
      await Promise.all(microsoftRoomPromises)
    ).filter<MicrosoftRoom>((room) => room != null)
    if (!microsoftRooms.length) return

    console.log(
      'GoogleWebhookHandler ~ #createEvent ~ microsoftRooms:',
      microsoftRooms
    )

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
    await this.eventRepository.save(event)
  }

  async #getMicrosoftRoomByGoogleEmail(
    email: string
  ): Promise<MicrosoftRoom | null> {
    const googleRoom = await this.googleRoomRepository.findOne({
      where: { email }
    })
    if (!googleRoom) return null
    const room = await this.roomRepository.findOne({
      where: { id: googleRoom.entityId }
    })
    if (!room) return null
    return (
      room.rooms.find(
        (workspaceRoom) => workspaceRoom instanceof MicrosoftRoom
      ) || null
    )
  }
}
