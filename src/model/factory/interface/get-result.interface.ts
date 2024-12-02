import { ArgsExtension, TypeMapPayload } from '@model/prisma'
import { GetResult, Operation } from '@prisma/client/runtime/library'
import { Model } from './factory.interface'

export type FactoryResult<M extends Model, A, O extends Operation> = GetResult<
  TypeMapPayload<M, ArgsExtension>,
  A,
  O
>

export type FactoryExtensionResult<
  M extends Model,
  A,
  O extends Operation
> = GetResult<TypeMapPayload<M, ArgsExtension>, A, O>
