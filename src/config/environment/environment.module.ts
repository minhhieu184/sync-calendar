import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PKDBatchTransferService } from './batch-transfer.service'
import { getEnvPath } from './envPath'
import { envSchema } from './envSchema'
import { EnvironmentService } from './environment.service'
import { PKDService } from './pkd.service'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(process.env.NODE_ENV),
      cache: true,
      expandVariables: true,
      validate: (config) => envSchema.parse(config)
    })
  ],
  providers: [EnvironmentService, PKDService, PKDBatchTransferService],
  exports: [EnvironmentService]
})
export class EnvironmentModule {}
