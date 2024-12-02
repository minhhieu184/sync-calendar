import { Global, Module } from '@nestjs/common'
import { TestService } from './test.service'

@Module({
  imports: [],
  controllers: [],
  providers: [TestService]
})
export class CalendarModule {}
