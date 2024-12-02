import { Module } from '@nestjs/common'
import { FactoryController } from './factory.controller'
import { ConfigurableModuleClass } from './factory.module-definition'
import { FactoryExtensionService, FactoryService } from './service'

@Module({
  controllers: [FactoryController],
  providers: [FactoryService, FactoryExtensionService],
  exports: [FactoryService, FactoryExtensionService]
})
export class FactoryModule extends ConfigurableModuleClass {}
