import { GoogleAuth } from '@model/google/google.service'
import { calendar_v3, google } from 'googleapis'

export function googleCalendar(): calendar_v3.Calendar {
  return google.calendar('v3')
}

/**
 * @param behalfOf user email to act on behalf of
 * If not provided, the service account will act on its own behalf
 */
export function googleAuth(behalfOf?: string): GoogleAuth {
  return new google.auth.GoogleAuth({
    clientOptions: { subject: behalfOf },
    scopes: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/admin.directory.user.readonly',
      'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly'
    ]
  })
}
