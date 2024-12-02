import { Prisma } from '@prisma/client'
import {
  Call,
  InternalArgs,
  MergeExtArgs
} from '@prisma/client/runtime/library'
import { ExtendArgsType } from '../prismaExtension'

type TypeMapPrismaExtension = Call<
  Prisma.TypeMapCb,
  { extArgs: ExtendArgsType }
>
type BaseArgsPrismaExtension = InternalArgs<
  ExtendArgsType['result'],
  ExtendArgsType['model'],
  ExtendArgsType['query'],
  ExtendArgsType['client']
>
/** ExtArgs for PrismaExtension */
type MergedArgsPrismaExtension = MergeExtArgs<
  TypeMapPrismaExtension,
  object,
  BaseArgsPrismaExtension
>
export type ArgsExtension = InternalArgs & MergedArgsPrismaExtension
