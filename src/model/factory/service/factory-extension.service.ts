import { generateSlug } from '@common'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  ArgsExtension,
  InjectPrismaExtension,
  PrismaExtension,
  TypeMapArgs
} from '../../prisma'
import { DefaultFindAllQueryDto } from '../dto'
import { InjectFactory } from '../factory.module-definition'
import {
  FactoryExtensionResult,
  FactoryModuleOptions,
  Model,
  ModelCreateArgs,
  ModelDeleteArgs,
  ModelFindFirstArgs,
  ModelFindManyArgs,
  ModelFindUniqueArgs,
  ModelUpdateArgs
} from '../interface'

/**
 * DEPRECATED: The option type is wrong
 */
@Injectable()
export class FactoryExtensionService<M extends Model> {
  public readonly model: PrismaExtension[Uncapitalize<M>]

  constructor(
    @InjectFactory() private options: FactoryModuleOptions,
    @InjectPrismaExtension private readonly prismaExtension: PrismaExtension
  ) {
    const modelKey = options.model[0].toLowerCase() + options.model.slice(1)
    this.model = prismaExtension[modelKey]
  }

  async findAll<A>(
    queryArgs: TypeMapArgs<M, 'findMany', ArgsExtension>['where'] &
      DefaultFindAllQueryDto,
    options?: Prisma.Exact<
      A,
      Omit<
        TypeMapArgs<M, 'findMany', ArgsExtension>,
        'where' | 'orderBy' | 'select' | 'skip' | 'take'
      >
    >
  ) {
    const { fields, page, sort, take, search, ...query } = queryArgs
    const defaultFindAllQuery = { fields, page, sort, take, search }

    const { searchQuery, ...defaultWhereInput } =
      this._defaultQueryToDefaultWhereInput(defaultFindAllQuery)

    const whereInput = {
      ...defaultWhereInput,
      where: { ...query, ...searchQuery }
    }

    const findManyFn = this.model.findMany<ModelFindManyArgs>
    const args = options ? Object.assign(whereInput, options) : whereInput
    const findManyQuery = findManyFn(args) as unknown as Prisma.PrismaPromise<
      FactoryExtensionResult<M, A, 'findMany'>
    >

    const countFn = this.model.count<ModelFindManyArgs>
    const countQuery = countFn({ where: { ...query, ...searchQuery } })

    const res = await this.prismaExtension.$transaction([
      countQuery,
      findManyQuery
    ])
    return {
      total: res[0],
      count: res[1].length,
      page: page || 1,
      data: res[1]
    }
  }

  private _defaultQueryToDefaultWhereInput(query: DefaultFindAllQueryDto) {
    const { fields, page, sort, take, search } = query
    /** OrderBy */
    const orderBy = sort?.split(',').map((item) => {
      const order = item.charAt(0)
      const field = order === '-' ? item.slice(1) : item
      return { [field]: order === '-' ? 'desc' : 'asc' }
    })
    /** Select */
    const select = fields?.split(',').reduce((acc, item) => {
      acc[item] = true
      return acc
    }, {})
    /** Pagination */
    const curTake = take || 10
    const curPage = page || 1
    const skip = (curPage - 1) * curTake

    /** Search */
    let searchQuery = {}
    if (search) {
      const containsName = generateSlug(search)
      const ftsName = containsName.replaceAll(' ', '&')
      searchQuery = {
        OR: [
          { slug: { search: ftsName, mode: 'insensitive' } },
          { slug: { contains: containsName, mode: 'insensitive' } }
        ]
      }
    }

    return { orderBy, select, skip, take: curTake, searchQuery }
  }

  findUnique<A extends TypeMapArgs<M, 'findUnique', ArgsExtension>>(
    id: TypeMapArgs<M, 'findUnique', ArgsExtension>['where']['id'],
    options?: Prisma.Exact<
      A,
      Omit<TypeMapArgs<M, 'findUnique', ArgsExtension>, 'where'>
    >
  ) {
    const findUniqueFn = this.model.findUnique<ModelFindUniqueArgs>
    const args = options
      ? Object.assign({ where: { id } }, options)
      : { where: { id } }
    return findUniqueFn(args) as Prisma.PrismaPromise<
      FactoryExtensionResult<M, A, 'findUnique'>
    >
  }

  async findUniqueOrThrow<A>(
    id: TypeMapArgs<M, 'findUniqueOrThrow', ArgsExtension>['where']['id'],
    options?: Prisma.Exact<
      A,
      Omit<TypeMapArgs<M, 'findUniqueOrThrow', ArgsExtension>, 'where'>
    >
  ) {
    const findUniqueOrThrowFn = this.model
      .findUniqueOrThrow<ModelFindUniqueArgs>
    const args = options
      ? Object.assign({ where: { id } }, options)
      : { where: { id } }
    return (await findUniqueOrThrowFn(args)) as FactoryExtensionResult<
      M,
      A,
      'findUniqueOrThrow'
    >
  }

  findFirst<A>(
    where?: TypeMapArgs<M, 'findFirst', ArgsExtension>['where'],
    options?: Prisma.Exact<
      A,
      Omit<TypeMapArgs<M, 'findFirst', ArgsExtension>, 'where'>
    >
  ) {
    const findFirstFn = this.model.findFirst<ModelFindFirstArgs>
    const args = options ? Object.assign({ where }, options) : { where }
    return findFirstFn(args) as Prisma.PrismaPromise<
      FactoryExtensionResult<M, A, 'findFirst'>
    >
  }

  async findFirstOrThrow<A>(
    where?: TypeMapArgs<M, 'findFirstOrThrow', ArgsExtension>['where'],
    options?: Prisma.Exact<
      A,
      Omit<TypeMapArgs<M, 'findFirstOrThrow', ArgsExtension>, 'where'>
    >
  ) {
    const findFirstOrThrowFn = this.model.findFirstOrThrow<ModelFindFirstArgs>
    const args = options ? Object.assign({ where }, options) : { where }
    return (await findFirstOrThrowFn(args)) as FactoryExtensionResult<
      M,
      A,
      'findFirstOrThrow'
    >
  }

  async create<A>(
    data: TypeMapArgs<M, 'create', ArgsExtension>['data'],
    options?: Prisma.Exact<
      A,
      Omit<TypeMapArgs<M, 'create', ArgsExtension>, 'data'>
    >
  ) {
    const createFn = this.model.create<ModelCreateArgs>
    const args = options ? Object.assign({ data }, options) : { data }
    return (await createFn(args)) as FactoryExtensionResult<M, A, 'create'>
  }

  async update<A>(
    id: TypeMapArgs<M, 'update', ArgsExtension>['where']['id'],
    data: TypeMapArgs<M, 'update', ArgsExtension>['data'],
    options?: Prisma.Exact<
      A,
      Omit<TypeMapArgs<M, 'update', ArgsExtension>, 'data' | 'where'>
    >
  ) {
    const updateFn = this.model.update<ModelUpdateArgs>
    const args = options
      ? Object.assign({ where: { id }, data }, options)
      : { where: { id }, data }
    return (await updateFn(args)) as FactoryExtensionResult<M, A, 'update'>
  }

  async delete<A>(
    id: TypeMapArgs<M, 'delete', ArgsExtension>['where']['id'],
    options?: Prisma.Exact<
      A,
      Omit<TypeMapArgs<M, 'update', ArgsExtension>, 'where'>
    >
  ) {
    const deleteFn = this.model.delete<ModelDeleteArgs>
    const args = options
      ? Object.assign({ where: { id } }, options)
      : { where: { id } }
    return (await deleteFn(args)) as FactoryExtensionResult<M, A, 'delete'>
  }
}
