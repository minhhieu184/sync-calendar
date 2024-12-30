import { Event, EventChannel, User } from '@model/db/entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MSAuthService } from './ms-auth.service'
import { TestService } from './test.service'
import { TestService2 } from './test2.service'
import { Webhook } from './webhook.controler'

@Module({
  imports: [TypeOrmModule.forFeature([User, EventChannel, Event])],
  controllers: [Webhook],
  providers: [TestService, TestService2, MSAuthService]
})
export class CalendarModule {}
