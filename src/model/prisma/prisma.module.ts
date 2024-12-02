import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { prismaExtensionProvider } from './prismaExtension'

@Global()
@Module({
  providers: [PrismaService, prismaExtensionProvider],
  exports: [prismaExtensionProvider]
})
export class PrismaModule {}
