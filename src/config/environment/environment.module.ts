import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PKDBatchTransferAssetService } from './batch-transfer-asset.service'
import { PKDBatchTransferService } from './batch-transfer.service'
import { getEnvPath } from './envPath'
import { envSchema } from './envSchema'
import { EnvironmentService } from './environment.service'
import { ListenTransactionService } from './find-transaction.service'
import { PaymentFlowService } from './payment-flow/payment-flow.service'
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
  providers: [
    EnvironmentService,
    PKDService,
    PKDBatchTransferService,
    PKDBatchTransferAssetService,
    PaymentFlowService,
    ListenTransactionService
  ],
  exports: [EnvironmentService]
})
export class EnvironmentModule {}
