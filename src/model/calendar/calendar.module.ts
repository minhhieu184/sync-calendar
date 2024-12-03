import { Global, Module } from '@nestjs/common'
import { TestService } from './test.service'
import { Webhook } from './webhook.controler'

@Module({
  imports: [],
  controllers: [Webhook],
  providers: [TestService]
})
export class CalendarModule {}
