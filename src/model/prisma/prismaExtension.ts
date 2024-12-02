import { Inject, Provider } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaService } from './prisma.service'

const extendArgs = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'GLS Extension',
    result: {
      user: {
        isAccessedToday: {
          needs: { name: true },
          compute(data) {
            const currentDate = new Date()
            currentDate.setHours(0, 0, 0, 0)
            return data.name == 'abc'
          }
        }
      }
    }
  })
})
export type ExtendArgsType = ReturnType<
  typeof extendArgs
>['$extends']['extArgs']

const generatePrismaExtension = (prisma: PrismaClient) => {
  // prisma.$on('query' as never, (e) => {
  //   logger.debug(`${e.query} -- ${e.params} duration: ${e.duration}ms`)
  // })
  return prisma.$extends(extendArgs)
}
export type PrismaExtension = ReturnType<typeof generatePrismaExtension>

const PRISMA_EXTENSION = Symbol('PRISMA_EXTENSION')
export const InjectPrismaExtension = Inject(PRISMA_EXTENSION)
export const prismaExtensionProvider: Provider = {
  provide: PRISMA_EXTENSION,
  useFactory: generatePrismaExtension,
  inject: [PrismaService]
}
