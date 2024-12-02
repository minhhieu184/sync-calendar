import { Prisma } from '@prisma/client'
import {
  Model,
  ModelCountArgs,
  ModelCreateArgs,
  ModelDeleteArgs,
  ModelFindFirstArgs,
  ModelFindFirstOrThrowArgs,
  ModelFindManyArgs,
  ModelFindUniqueArgs,
  ModelFindUniqueOrThrowArgs,
  ModelQueryResult,
  ModelUpdateArgs
} from '../base.interface'

export interface IBaseRepository<M extends Model> {
  findMany<T extends ModelFindManyArgs<M>>(
    args?: Prisma.SelectSubset<T, ModelFindManyArgs<M>>
  ): Prisma.PrismaPromise<ModelQueryResult<M, T, 'findMany'>>

  findUnique<K extends Omit<ModelFindUniqueArgs<M>, 'where'>>(
    id: ModelFindUniqueArgs<M>['where']['id'],
    options?: Prisma.SelectSubset<K, Omit<ModelFindUniqueArgs<M>, 'where'>>
  ): Prisma.PrismaPromise<ModelQueryResult<M, K, 'findUnique'>>

  findUniqueOrThrow<K extends Omit<ModelFindUniqueOrThrowArgs<M>, 'where'>>(
    id: ModelFindUniqueOrThrowArgs<M>['where']['id'],
    options?: Prisma.SelectSubset<
      K,
      Omit<ModelFindUniqueOrThrowArgs<M>, 'where'>
    >
  ): Promise<ModelQueryResult<M, K, 'findUniqueOrThrow'>>

  findFirst<
    T extends ModelFindFirstArgs<M>['where'],
    K extends Omit<ModelFindFirstArgs<M>, 'where'>
  >(
    where?: Prisma.SelectSubset<T, NonNullable<ModelFindFirstArgs<M>['where']>>,
    options?: Prisma.SelectSubset<K, Omit<ModelFindFirstArgs<M>, 'where'>>
  ): Prisma.PrismaPromise<ModelQueryResult<M, K, 'findFirst'>>

  findFirstOrThrow<
    T extends ModelFindFirstOrThrowArgs<M>['where'],
    K extends Omit<ModelFindFirstOrThrowArgs<M>, 'where'>
  >(
    where?: Prisma.SelectSubset<
      T,
      NonNullable<ModelFindFirstOrThrowArgs<M>['where']>
    >,
    options?: Prisma.SelectSubset<
      K,
      Omit<ModelFindFirstOrThrowArgs<M>, 'where'>
    >
  ): Promise<ModelQueryResult<M, K, 'findFirstOrThrow'>>

  create<
    T extends ModelCreateArgs<M>['data'],
    K extends Omit<ModelCreateArgs<M>, 'data'>
  >(
    data: Prisma.SelectSubset<T, ModelCreateArgs<M>['data']>,
    options?: Prisma.SelectSubset<K, Omit<ModelCreateArgs<M>, 'data'>>
  ): Promise<ModelQueryResult<M, K, 'create'>>

  update<
    T extends ModelUpdateArgs<M>['data'],
    K extends Omit<ModelUpdateArgs<M>, 'data' | 'where'>
  >(
    id: ModelUpdateArgs<M>['where']['id'],
    data: Prisma.SelectSubset<T, ModelUpdateArgs<M>['data']>,
    options?: Prisma.SelectSubset<K, Omit<ModelUpdateArgs<M>, 'data' | 'where'>>
  ): Promise<ModelQueryResult<M, K, 'update'>>

  delete<T extends Omit<ModelDeleteArgs<M>, 'where'>>(
    id: ModelDeleteArgs<M>['where']['id'],
    options?: Prisma.SelectSubset<T, Omit<ModelDeleteArgs<M>, 'where'>>
  ): Promise<ModelQueryResult<M, T, 'delete'>>

  count<T extends ModelCountArgs<M>>(
    args?: Prisma.SelectSubset<T, ModelCountArgs<M>>
  ): Prisma.PrismaPromise<ModelQueryResult<M, T, 'count'>>
}
