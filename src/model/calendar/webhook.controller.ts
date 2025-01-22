import { certHelper, googleAuth, tokenHelper } from '@common'
import {
  ChangeNotification,
  ChangeNotificationCollection,
  Event as MSEvent
} from '@microsoft/microsoft-graph-types'
import { GoogleEventChannel } from '@model/db/entity'
import { Body, Controller, Headers, Post, Query, Res } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import { Response } from 'express'
import { google } from 'googleapis'
import { Repository } from 'typeorm'
import { GoogleWebhookHandler } from './google-webhook-handler'
import { MicrosoftWebhookHandler } from './microsoft-webhook-handler'

interface CreateSubscriptionQuery {
  validationToken?: string
  email?: string
}

@Controller('webhook')
export class Webhook {
  constructor(
    private readonly googleWebhookHandler: GoogleWebhookHandler,
    private readonly microsoftWebhookHandler: MicrosoftWebhookHandler,
    @InjectRepository(GoogleEventChannel)
    private eventChannelRepository: Repository<GoogleEventChannel>
  ) {}

  @Post('google')
  async index(
    @Body() body: any,
    @Headers() headers: any,
    @Query('email') email: string
  ) {
    console.log('EVENTTTTT', email)

    const calendar = google.calendar({ version: 'v3', auth: googleAuth(email) })
    const eventChannel = await this.eventChannelRepository.findOne({
      where: { email }
    })
    if (!eventChannel) return
    const {
      data: { items, nextSyncToken }
    } = await calendar.events.list({
      calendarId: 'primary',
      syncToken: eventChannel.syncToken,
      maxResults: 2500
    })

    if (nextSyncToken) {
      eventChannel.syncToken = nextSyncToken
      await this.eventChannelRepository.save(eventChannel)
    }

    console.log('Webhook ~ items:', items)
    if (!items) return

    await Promise.allSettled(
      items.map((item) => this.googleWebhookHandler.handle(email, item))
    )
  }

  @Post('microsoft')
  async index2(
    @Body() body: ChangeNotificationCollection,
    @Query() query: CreateSubscriptionQuery,
    @Res() res: Response
  ) {
    if (query.validationToken) {
      res.setHeader('Content-Type', 'text/plain')
      res.status(201).send(query.validationToken)
      return
    }

    try {
      const email = query.email
      if (!email) throw new Error('Email is required')

      // Check for validation tokens, validate them if present
      let areTokensValid = true
      if (body.validationTokens) {
        const appId = process.env.OAUTH_CLIENT_ID || ''
        const tenantId = process.env.OAUTH_TENANT_ID || ''
        const validationResults = await Promise.all(
          body.validationTokens.map((token) =>
            tokenHelper.isTokenValid(token, appId, tenantId)
          )
        )
        areTokensValid = validationResults.reduce((x, y) => x && y)
      }
      if (!areTokensValid) return

      const value = body.value
      if (!value) return
      const decryptedValue = value.reduce<ChangeNotification[]>(
        (acc, notification) => {
          if (!notification.encryptedContent) return acc
          const { data, dataKey, dataSignature } = notification.encryptedContent
          if (!data || !dataKey || !dataSignature) return acc
          if (!process.env.PRIVATE_KEY_PATH) return acc

          // Decrypt the symmetric key sent by Microsoft Graph
          const symmetricKey = certHelper.decryptSymmetricKey(
            dataKey,
            process.env.PRIVATE_KEY_PATH
          )
          // Validate the signature on the encrypted content
          const isSignatureValid = certHelper.verifySignature(
            dataSignature,
            data,
            symmetricKey
          )
          if (!isSignatureValid) return acc

          // Decrypt the payload
          const decryptedPayload = certHelper.decryptPayload(data, symmetricKey)
          const eventData: MSEvent = JSON.parse(decryptedPayload)

          notification.id = randomUUID()
          notification.resourceData = {
            id: notification.resourceData?.['id'],
            ...eventData
          }
          return [...acc, notification]
        },
        []
      )

      await Promise.all(
        decryptedValue.map((notification) =>
          this.microsoftWebhookHandler.handle(email, notification)
        )
      )
    } catch (error) {
      console.error('Webhook ~ error:', error)
    } finally {
      res.status(202).end()
    }
  }

  // @Post('microsoft/lifecycle')
  // async index3(@Query() query: any, @Res() res: Response) {
  //   if (query && query.validationToken) {
  //     res.setHeader('Content-Type', 'text/plain')
  //     res.status(201).send(query.validationToken)
  //     return
  //   }
  // }
}
