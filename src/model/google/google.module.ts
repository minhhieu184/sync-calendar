import { Global, Module } from '@nestjs/common'
import { GoogleAuth } from './google.service'

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [GoogleAuth],
  exports: [GoogleAuth]
})
export class GoogleModule {}
