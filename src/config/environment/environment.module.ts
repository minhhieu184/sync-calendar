import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PKDBatchTransferAssetService } from './batch-transfer-asset.service'
import { PKDBatchTransferService } from './batch-transfer.service'
import { getEnvPath } from './envPath'
import { envSchema } from './envSchema'
import { EnvironmentService } from './environment.service'
import { ListenTransactionService } from './find-transaction.service'
import { PaymentFlowTokenService } from './payment-flow-token/payment-flow-token.service'
import { PaymentFlowNativeService } from './payment-flow/payment-flow-native.service'
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
    ListenTransactionService,
    PaymentFlowNativeService,
    PaymentFlowTokenService
  ],
  exports: [EnvironmentService]
})
export class EnvironmentModule {}
