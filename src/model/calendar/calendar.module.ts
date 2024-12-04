import { Module } from '@nestjs/common'
import { TestService } from './test.service'
import { TestService2 } from './test2.service'
import { Webhook } from './webhook.controler'

@Module({
  imports: [],
  controllers: [Webhook],
  providers: [TestService, TestService2]
})
export class CalendarModule {}
