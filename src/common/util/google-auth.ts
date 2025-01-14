import { google } from 'googleapis'

/**
 * @param behalfOf user email to act on behalf of
 * If not provided, the service account will act on its own behalf
 */
export function googleAuth(behalfOf?: string) {
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
