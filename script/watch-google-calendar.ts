import { googleAuth, googleCalendar } from '@common'
import { default as DataSource } from '@model/db/data-source'
import { EventChannel } from '@model/db/entity'
import { GoogleAuth } from '@model/google/google.service'
import { GaxiosError } from 'gaxios'
import { calendar_v3 } from 'googleapis'
import { LessThan } from 'typeorm'

/**
 *
 * This script is used to watch google calendar for all users in the domain
 * It will create a watch channel for each user in the domain
 * It will renew the watch channel if the channel is expired
 */
async function main() {
  const THRESHOLD_EXPIRED_AT = new Date(Date.now() + 115 * 24 * 60 * 60 * 1000) // 5 days

  const calendar = googleCalendar()
  await DataSource.initialize()
  const eventChannelRepository = DataSource.getRepository(EventChannel)

  // Remove all channels that are about to expire
  const inactiveChannels = await eventChannelRepository.find({
    where: { expiredAt: LessThan(THRESHOLD_EXPIRED_AT) }
  })
  console.log('inactiveChannels ~ inactiveChannels:', inactiveChannels)
  await Promise.allSettled(
    inactiveChannels.map(({ email, resourceId }) =>
      removeChannel(googleAuth(email), calendar, resourceId)
    )
  )

  // Find new emails that are not in the EventChannel table
  const allEmails = await allEmailsInWorkspace()
  const newEmails = await filterNewEmails(allEmails)

  // Create channels for new emails and deleted channels
  const createChannelEmails = newEmails.concat(
    inactiveChannels.map(({ email }) => email)
  )
  const newChannelsData = await Promise.all(
    createChannelEmails.map((email) => createChannel(calendar, email))
  )
  console.log(
    'main ~ newChannelsData:',
    newChannelsData.map((data) => ({
      ...data,
      ex: new Date(+(data?.expiration || 0))
    }))
  )

  //! Fix this: For testing purpose
  const nextSyncTokens = await Promise.all(
    createChannelEmails.map(async (email) => {
      const auth = googleAuth(email)
      const {
        data: { nextSyncToken }
      } = await calendar.events.list({
        calendarId: 'primary',
        auth,
        maxResults: 2500
      })
      return nextSyncToken
    })
  )

  // Save new channels to the database
  const newChannels = newChannelsData.reduce<EventChannel[]>(
    (acc, data, index) => {
      if (!data || !data.resourceId) return acc
      const channel = new EventChannel()
      channel.email = createChannelEmails[index]
      channel.expiredAt = new Date(+(data.expiration || 0))
      channel.channelId = 'SyncCalendarIceTea'
      channel.resourceId = data.resourceId
      channel.syncToken = nextSyncTokens[index] || ''
      acc.push(channel)
      return acc
    },
    []
  )

  await eventChannelRepository.upsert(newChannels, ['email'])
}

async function allEmailsInWorkspace() {
  // const adminAuth = googleAuth(process.env.GOOGLE_ADMIN_EMAIL)
  // const {
  //   data: { users }
  // } = await google
  //   .admin('directory_v1')
  //   .users.list({ domain: 'icetea.io', maxResults: 500, auth: adminAuth })
  // if (!users) throw new Error('No users found in the domain')

  // const emails = users.reduce<string[]>((acc, { primaryEmail }) => {
  //   if (primaryEmail) acc.push(primaryEmail)
  //   return acc
  // }, [])
  // console.log('main ~ emails:', emails)
  // return emails
  const dumpEmails = ['hieu.pham1@icetea.io', 'tung.cong@icetea.io']
  return dumpEmails
}

async function filterNewEmails(remoteEmails: string[]): Promise<string[]> {
  let newEmails: string[] = []
  if (remoteEmails.length !== 0) {
    const newEmailsData = await DataSource.manager.query<{ email: string }[]>(
      `
      SELECT email
      FROM UNNEST(ARRAY${JSON.stringify(remoteEmails).replaceAll('"', "'")}) AS input_emails(email)
      WHERE email NOT IN (SELECT email FROM event_channel)
    `
    )
    newEmails = newEmailsData.map(({ email }) => email)
  }
  return newEmails
}

async function createChannel(calendar: calendar_v3.Calendar, email: string) {
  try {
    const { data } = await calendar.events.watch({
      auth: googleAuth(email),
      calendarId: 'primary',
      requestBody: {
        id: 'SyncCalendarIceTea',
        type: 'webhook',
        address:
          `${process.env.WEBHOOK_DOMAIN}/api/v1/webhook/google?email=` + email,
        expiration: (Date.now() + 30 * 24 * 60 * 60 * 1000).toString()
      }
    })
    return data
  } catch (error) {
    console.log('createChannel ~ error:', error)
  }
}

async function removeChannel(
  auth: GoogleAuth,
  calendar: calendar_v3.Calendar,
  resourceId: string
) {
  return calendar.channels.stop({
    auth,
    requestBody: {
      id: 'SyncCalendarIceTea',
      resourceId
    }
  })
}

main()
  .catch((e) => {
    if (e instanceof GaxiosError) {
      console.log('❌ GaxiosError:', e.response?.data.error)
      console.log(e.stack)
      return
    }
    console.error('❌ Failed setup watch channel for google calendar:', e)
  })
  .finally(() => process.exit(0))
