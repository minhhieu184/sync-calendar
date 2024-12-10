import { User } from '@model/db/entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TestService } from './test.service'
import { TestService2 } from './test2.service'
import { Webhook } from './webhook.controler'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [Webhook],
  providers: [TestService, TestService2]
})
export class CalendarModule {}
