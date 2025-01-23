import { certHelper } from '@common'
import { Client } from '@microsoft/microsoft-graph-client'
import { Subscription, User } from '@microsoft/microsoft-graph-types'
import { MSAuthService } from '@model/calendar/ms-auth.service'
import { default as DataSource } from '@model/db/data-source'
import { MicrosoftRoom } from '@model/db/entity'
import { GaxiosError } from 'gaxios'

interface SubscriptionWithMail extends Subscription {
  mail: string
}

/**
 * This script is used to watch google calendar for all users in the domain.
 * It will create a watch channel for each user in the domain.
 * It will renew the watch channel if the channel is expired.
 */
const THRESHOLD_EXPIRED_AT = new Date(Date.now() + 112 * 24 * 60 * 60 * 1000) // 2 days
const MAX_EXPIRED_AT = new Date(Date.now() + 10070 * 60 * 1000) // 1 week

async function main() {
  const msAuthService = new MSAuthService()
  const client = msAuthService.client

  const allMails = await getAllEmailsInWorkspace(client)
  console.log('main ~ allMails:', allMails.length)
  const setAllMails = new Set(allMails)

  const subscriptions = await getSubscriptionsWithMail(client)
  console.log('main ~ subscriptions:', subscriptions.length)

  const { needToRemoveSubs, needToRenewSubs, restSubs } = subscriptions.reduce<{
    needToRemoveSubs: SubscriptionWithMail[]
    needToRenewSubs: SubscriptionWithMail[]
    restSubs: SubscriptionWithMail[]
  }>(
    (acc, subscription) => {
      const { notificationUrl, expirationDateTime, mail } = subscription
      const isChangeWebhookDomain = !notificationUrl?.startsWith(
        process.env.WEBHOOK_DOMAIN || ''
      )
      if (isChangeWebhookDomain) {
        return {
          ...acc,
          needToRemoveSubs: [...acc.needToRemoveSubs, subscription]
        }
      }
      if (
        expirationDateTime &&
        new Date(expirationDateTime) < THRESHOLD_EXPIRED_AT &&
        setAllMails.has(mail)
      ) {
        return {
          ...acc,
          needToRenewSubs: [...acc.needToRenewSubs, subscription]
        }
      }
      return { ...acc, restSubs: [...acc.restSubs, subscription] }
    },
    { needToRemoveSubs: [], needToRenewSubs: [], restSubs: [] }
  )

  // Delete subscriptions
  console.log('main ~ needToRemoveSubs:', needToRemoveSubs.length)
  await Promise.all(
    needToRemoveSubs.map(({ id }) =>
      client.api(`/subscriptions/${id}`).delete()
    )
  )
  console.log('done delete')

  // Renew about to expire subscriptions
  console.log('main ~ needToRenewSubs:', needToRenewSubs.length)
  await renewSubscriptions(client, needToRenewSubs)
  console.log('done renew')

  // Create channels for new emails
  const currentSubscriptions = [...restSubs, ...needToRenewSubs]
  const setSubscriptionMail = new Set(
    currentSubscriptions.map(({ mail }) => mail)
  )
  const newMails = allMails.filter((mail) => !setSubscriptionMail.has(mail))
  console.log('main ~ newMails:', newMails.length)
  const response = await Promise.allSettled(
    newMails.map((mail) => createSubscription(client, mail))
  )
  console.log(
    'create success:',
    response.filter((r) => r.status === 'fulfilled').length
  )
}

async function getAllEmailsInWorkspace(client: Client): Promise<string[]> {
  // if (process.env.NODE_ENV === 'development')
  //   return ['hieuptm@iceteasoftware.com', 'vietnx@iceteasoftware.com']

  await DataSource.initialize()
  const microsoftRoomRepository = DataSource.getRepository(MicrosoftRoom)
  const msRooms = await microsoftRoomRepository.find()
  const setMSRoom = new Set(msRooms.map(({ email }) => email))

  const users = (await client.api('/users?$top=999').get()).value as User[]
  return users.reduce<string[]>((acc, { mail }) => {
    if (!mail) return acc
    if (!mail.endsWith('@iceteasoftware.com')) return acc
    if (setMSRoom.has(mail)) return acc
    return [...acc, mail]
  }, [])
}

async function getSubscriptionsWithMail(
  client: Client
): Promise<SubscriptionWithMail[]> {
  let nextLink = '/subscriptions'
  const subscriptionsWithoutMail: Subscription[] = []
  do {
    const subscriptionResponse = await client.api(nextLink).get()
    subscriptionsWithoutMail.push(...subscriptionResponse.value)
    nextLink = subscriptionResponse['@odata.nextLink']
  } while (nextLink)

  const subscriptionsWithMail = subscriptionsWithoutMail.reduce<
    SubscriptionWithMail[]
  >((acc, subscription) => {
    if (subscription.encryptionCertificateId !== process.env.CERTIFICATE_ID)
      return acc
    if (!subscription.resource) return acc
    const mail = subscription.resource.split('/')[1]
    if (!mail) return acc
    return [...acc, { ...subscription, mail }]
  }, [])
  return subscriptionsWithMail
}

async function renewSubscriptions(
  client: Client,
  inactiveSubscriptions: SubscriptionWithMail[]
) {
  await Promise.all(
    inactiveSubscriptions.map(({ id, mail }) =>
      client.api(`/subscriptions/${id}`).update({
        notificationUrl: `${process.env.WEBHOOK_DOMAIN}/api/v1/webhook/microsoft?email=${mail}`,
        expirationDateTime: MAX_EXPIRED_AT.toISOString()
      })
    )
  )
}

function createSubscription(client: Client, mail: string) {
  const subscription: Subscription = {
    changeType: 'created,updated,deleted',
    notificationUrl: `${process.env.WEBHOOK_DOMAIN}/api/v1/webhook/microsoft?email=${mail}`,
    // lifecycleNotificationUrl: `${process.env.WEBHOOK_DOMAIN}/api/v1/webhook/microsoft/lifecycle`,
    resource: `users/${mail}/events?$select=id,subject,organizer,attendees,start,end,isCancelled,isDraft`,
    includeResourceData: true,
    encryptionCertificate: certHelper.getSerializedCertificate(
      process.env.CERTIFICATE_PATH!
    ),
    encryptionCertificateId: process.env.CERTIFICATE_ID,
    expirationDateTime: MAX_EXPIRED_AT.toISOString() // 1 week
  }
  return client.api('/subscriptions').create(subscription)
}

main()
  .catch((e) => {
    if (e instanceof GaxiosError) {
      console.log('❌ GaxiosError:', e.response?.data.error)
      console.log(e.stack)
      return
    }
    console.error('❌ Failed setup subscription for microsoft calendar:', e)
  })
  .finally(() => process.exit(0))
