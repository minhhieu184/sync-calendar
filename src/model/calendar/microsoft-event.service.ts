import { Event as MSEvent } from '@microsoft/microsoft-graph-types'
import { Room } from '@model/db/entity'
import { Injectable } from '@nestjs/common'
import { calendar_v3 } from 'googleapis'
import { noop } from 'rxjs'
import { MSAuthService } from './ms-auth.service'

export class CreateMicrosoftEventDto {
  start: Date
  end: Date
  summary: string
  organizer: string
  description: string
  rooms: Room[] = []

  constructor(item: calendar_v3.Schema$Event, rooms: Room[]) {
    this.start = this.#eventDateTimeToDate(item.start)
    this.end = this.#eventDateTimeToDate(item.end)
    this.summary = item.summary || ''
    this.organizer = item.organizer?.email || ''
    this.description = item.description || ''
    this.rooms = rooms
  }

  #eventDateTimeToDate(dateTime?: calendar_v3.Schema$EventDateTime) {
    if (dateTime?.dateTime) return new Date(dateTime.dateTime)
    if (dateTime?.date)
      return new Date(new Date(dateTime.date).getTime() - 7 * 60 * 60 * 1000)
    return new Date(0)
  }
}

@Injectable()
export class MicrosoftEventService {
  constructor(private readonly msAuthService: MSAuthService) {}

  async getOne(
    email: string,
    eventId: string,
    query?: string
  ): Promise<MSEvent> {
    return this.msAuthService.client
      .api(`/users/${email}/events/${eventId}?${query}`)
      .get()
  }

  async create(
    email: string,
    createEventDto: CreateMicrosoftEventDto
  ): Promise<MSEvent> {
    return new Promise((resolve, reject) => {
      this.msAuthService.client
        .api(`/users/${email}/events`)
        .post(
          {
            subject: createEventDto.summary,
            start: {
              dateTime: createEventDto.start.toISOString(),
              timeZone: 'SE Asia Standard Time'
            },
            end: {
              dateTime: createEventDto.end.toISOString(),
              timeZone: 'SE Asia Standard Time'
            },
            body: {
              contentType: 'html',
              content: createEventDto.description
            },
            attendees: createEventDto.rooms.map((room) => ({
              status: { response: 'none' },
              emailAddress: { address: room.email }
            }))
          },
          (err, res) => {
            if (err) return reject(err)
            resolve(res)
          }
        )
        .catch(noop)
    })
  }

  async update(
    email: string,
    id: string,
    updateEventDto: CreateMicrosoftEventDto
  ): Promise<MSEvent> {
    return new Promise((resolve, reject) => {
      this.msAuthService.client
        .api(`/users/${email}/events/${id}`)
        .patch(
          {
            subject: updateEventDto.summary,
            start: {
              dateTime: updateEventDto.start.toISOString(),
              timeZone: 'SE Asia Standard Time'
            },
            end: {
              dateTime: updateEventDto.end.toISOString(),
              timeZone: 'SE Asia Standard Time'
            },
            body: {
              contentType: 'html',
              content: updateEventDto.description
            },
            attendees: updateEventDto.rooms.map((room) => ({
              status: { response: 'none' },
              emailAddress: { address: room.email }
            }))
          },
          (err, res) => {
            if (err) return reject(err)
            resolve(res)
          }
        )
        .catch(noop)
    })
  }

  async delete(email: string, eventId: string) {
    return new Promise((resolve, reject) => {
      this.msAuthService.client
        .api(`/users/${email}/events/${eventId}`)
        .delete((err, res) => {
          if (err) return reject(err)
          resolve(res)
        })
        .catch(noop)
    })
  }
}
