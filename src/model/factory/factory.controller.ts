import { Controller } from '@nestjs/common'
import { FactoryExtensionService, FactoryService } from './service'

@Controller('factory')
export class FactoryController {
  constructor(
    private readonly fes: FactoryExtensionService<'User'>,
    private readonly f: FactoryService<'User'>
  ) {}
}
