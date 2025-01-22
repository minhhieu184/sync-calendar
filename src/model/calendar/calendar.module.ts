import {
  Event,
  GoogleEventChannel,
  GoogleRoom,
  GoogleRoomRepository,
  MicrosoftRoom,
  MicrosoftRoomRepository,
  Room,
  RoomEvent,
  RoomRepository
} from '@model/db/entity'
import { Module, Type } from '@nestjs/common'
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule
} from '@nestjs/typeorm'
import { DataSource, ObjectLiteral } from 'typeorm'
import { AbstractPolymorphicRepository } from 'typeorm-polymorphic'
import { GoogleEventService } from './google-event.service'
import { GoogleWebhookHandler } from './google-webhook-handler'
import { MicrosoftEventService } from './microsoft-event.service'
import { MicrosoftWebhookHandler } from './microsoft-webhook-handler'
import { MSAuthService } from './ms-auth.service'
import { TestService } from './test.service'
import { TestService2 } from './test2.service'
import { Webhook } from './webhook.controller'

interface PolymorphicSource<TypeEntity extends Function = Function> {
  entity: TypeEntity
  repository: Type<AbstractPolymorphicRepository<ObjectLiteral>>
}
const PolymorphicSources: PolymorphicSource[] = [
  {
    entity: GoogleRoom,
    repository: GoogleRoomRepository
  },
  {
    entity: MicrosoftRoom,
    repository: MicrosoftRoomRepository
  },
  {
    entity: Room,
    repository: RoomRepository
  }
]
const PolymorphicProviders = PolymorphicSources.map(
  ({ entity, repository }) => ({
    provide: getRepositoryToken(entity),
    useFactory: (DataSource: DataSource) =>
      AbstractPolymorphicRepository.createRepository(DataSource, repository),
    inject: [getDataSourceToken()]
  })
)

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GoogleEventChannel,
      Event,
      MicrosoftRoom,
      GoogleRoom,
      Room,
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
    MicrosoftWebhookHandler,
    ...PolymorphicProviders
  ]
})
export class CalendarModule {}
