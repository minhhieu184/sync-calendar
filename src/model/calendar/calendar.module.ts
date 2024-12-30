import {
  Event,
  GoogleEventChannel,
  GoogleRoom,
  MicrosoftRoom,
  RoomEvent,
  User
} from '@model/db/entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GoogleWebhookHandler } from './google-webhook-handler'
import { MicrosoftEventService } from './microsoft-event.service'
import { MSAuthService } from './ms-auth.service'
import { TestService } from './test.service'
import { TestService2 } from './test2.service'
import { Webhook } from './webhook.controler'
import { MicrosoftWebhookHandler } from './microsoft-webhook-handler'
import { GoogleEventService } from './google-event.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      GoogleEventChannel,
      Event,
      MicrosoftRoom,
      GoogleRoom,
      RoomEvent
    ])
  ],
  controllers: [Webhook],
  providers: [
    TestService,
    TestService2,
    MSAuthService,
    GoogleWebhookHandler,
    MicrosoftEventService,
    GoogleEventService,
    MicrosoftWebhookHandler
  ]
})
export class CalendarModule {}
