import { ConfigurableModuleBuilder, Inject } from '@nestjs/common'
import { FactoryModuleOptions } from './interface'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<FactoryModuleOptions>().build()

export const InjectFactory = () => Inject(MODULE_OPTIONS_TOKEN)
