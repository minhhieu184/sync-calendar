import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { getEnvPath } from './envPath'
import { envSchema } from './envSchema'
import { EnvironmentService } from './environment.service'

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
  providers: [EnvironmentService],
  exports: [EnvironmentService]
})
export class EnvironmentModule {}
