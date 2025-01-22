import { googleAuth } from '@common'
import {
  DateTimeTimeZone,
  Event as MSEvent,
  NullableOption
} from '@microsoft/microsoft-graph-types'
import { WorkspaceRoom } from '@model/db/entity'
import { Injectable } from '@nestjs/common'
import { calendar_v3, google } from 'googleapis'

export class CreateGoogleEventDto {
  start: Date
  end: Date
  summary: string
  description: string
  organizer: string
  rooms: WorkspaceRoom[] = []

  constructor(item: MSEvent, rooms: WorkspaceRoom[]) {
    this.start = this.#eventDateTimeToDate(item.start)
    this.end = this.#eventDateTimeToDate(item.end)
    this.summary = item.subject || ''
    this.description = ''
    this.rooms = rooms
    this.organizer = item.organizer?.emailAddress?.address || ''
  }

  #eventDateTimeToDate(
    dateTime?: NullableOption<DateTimeTimeZone> | undefined
  ) {
    if (dateTime?.dateTime) return new Date(dateTime.dateTime + 'Z')
    return new Date(0)
  }
}

@Injectable()
export class GoogleEventService {
  #calendar = google.calendar('v3')

  async create(
    email: string,
    createEventDto: CreateGoogleEventDto
  ): Promise<calendar_v3.Schema$Event> {
    const { data } = await this.#calendar.events.insert({
      auth: googleAuth(email),
      calendarId: 'primary',
      requestBody: {
        summary: createEventDto.summary,
        description: createEventDto.description,
        start: { dateTime: createEventDto.start.toISOString() },
        end: { dateTime: createEventDto.end.toISOString() },
        attendees: createEventDto.rooms.map((room) => ({
          email: room.email,
          resource: true
        })),
        creator: { email },
        organizer: { email }
      }
    })
    return data
  }

  async update(
    email: string,
    id: string,
    updateEventDto: CreateGoogleEventDto
  ): Promise<calendar_v3.Schema$Event> {
    const { data } = await this.#calendar.events.update({
      eventId: id,
      auth: googleAuth(email),
      calendarId: 'primary',
      requestBody: {
        summary: updateEventDto.summary,
        description: updateEventDto.description,
        start: { dateTime: updateEventDto.start.toISOString() },
        end: { dateTime: updateEventDto.end.toISOString() },
        attendees: updateEventDto.rooms.map((room) => ({
          email: room.email,
          resource: true
        })),
        creator: { email },
        organizer: { email }
      }
    })
    return data
  }

  async delete(email: string, eventId: string) {
    return this.#calendar.events.delete({
      auth: googleAuth(email),
      calendarId: 'primary',
      eventId
    })
  }
}
