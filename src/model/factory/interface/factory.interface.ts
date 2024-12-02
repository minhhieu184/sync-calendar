import { Prisma } from '@prisma/client'

export interface FactoryModuleOptions<M extends Model = Model> {
  model: M
}

export type Model = Prisma.ModelName
