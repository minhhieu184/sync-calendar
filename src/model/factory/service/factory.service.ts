import { generateSlug } from '@common'
import {
  ArgsExtension,
  InjectPrismaExtension,
  PrismaExtension,
  TypeMapArgs
} from '@model/prisma'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DefaultFindAllQueryDto } from '../dto'
import { InjectFactory } from '../factory.module-definition'
import {
  FactoryModuleOptions,
  FactoryResult,
  Model,
  ModelCreateArgs,
  ModelDeleteArgs,
  ModelFindFirstArgs,
  ModelFindManyArgs,
  ModelFindUniqueArgs,
  ModelUpdateArgs
} from '../interface'

@Injectable()
export class FactoryService<M extends Model> {
  public readonly model: PrismaExtension[Uncapitalize<M>]

  constructor(
    @InjectFactory() private options: FactoryModuleOptions<M>,
    @InjectPrismaExtension private readonly prisma: PrismaExtension
  ) {
    const modelKey = options.model[0].toLowerCase() + options.model.slice(1)
    this.model = prisma[modelKey]
  }

  async findAll<
    T extends TypeMapArgs<M, 'findMany', ArgsExtension>['where'] &
      DefaultFindAllQueryDto,
    K extends Omit<
      TypeMapArgs<M, 'findMany', ArgsExtension>,
      'where' | 'orderBy' | 'select' | 'skip' | 'take'
    >
  >(
    queryArgs: Prisma.SelectSubset<
      T,
      NonNullable<
        TypeMapArgs<M, 'findMany', ArgsExtension>['where'] &
          DefaultFindAllQueryDto
      >
    >,
    options?: Prisma.SelectSubset<
      K,
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
      FactoryResult<M, K, 'findMany'>
    >

    const countFn = this.model.count<ModelFindManyArgs>
    const countQuery = countFn({ where: { ...query, ...searchQuery } })

    const data = await this.prisma.$transaction([countQuery, findManyQuery])
    return {
      total: data[0],
      count: data[1].length,
      page,
      data: data[1]
    }
  }

  private _defaultQueryToDefaultWhereInput(query: DefaultFindAllQueryDto) {
    const { fields, page = 1, sort, take = 10, search } = query
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
    const skip = (page - 1) * take

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

    return { orderBy, select, skip, take, searchQuery }
  }

  findUnique<
    K extends Omit<TypeMapArgs<M, 'findUnique', ArgsExtension>, 'where'>
  >(
    id: TypeMapArgs<M, 'findUnique', ArgsExtension>['where']['id'],
    options?: Prisma.SelectSubset<
      K,
      Omit<TypeMapArgs<M, 'findUnique', ArgsExtension>, 'where'>
    >
  ) {
    const findUniqueFn = this.model.findUnique<ModelFindUniqueArgs>
    const args = options
      ? Object.assign({ where: { id } }, options)
      : { where: { id } }
    return findUniqueFn(args) as Prisma.PrismaPromise<
      FactoryResult<M, K, 'findUnique'>
    >
  }

  async findUniqueOrThrow<
    K extends Omit<TypeMapArgs<M, 'findUniqueOrThrow', ArgsExtension>, 'where'>
  >(
    id: TypeMapArgs<M, 'findUniqueOrThrow', ArgsExtension>['where']['id'],
    options?: Prisma.SelectSubset<
      K,
      Omit<TypeMapArgs<M, 'findUniqueOrThrow', ArgsExtension>, 'where'>
    >
  ) {
    const findUniqueOrThrowFn = this.model
      .findUniqueOrThrow<ModelFindUniqueArgs>
    const args = options
      ? Object.assign({ where: { id } }, options)
      : { where: { id } }
    return (await findUniqueOrThrowFn(args)) as FactoryResult<
      M,
      K,
      'findUnique'
    >
  }

  findFirst<
    T extends TypeMapArgs<M, 'findFirst', ArgsExtension>['where'],
    K extends Omit<TypeMapArgs<M, 'findFirst', ArgsExtension>, 'where'>
  >(
    where?: Prisma.SelectSubset<
      T,
      NonNullable<TypeMapArgs<M, 'findFirst', ArgsExtension>['where']>
    >,
    options?: Prisma.SelectSubset<
      K,
      Omit<TypeMapArgs<M, 'findFirst', ArgsExtension>, 'where'>
    >
  ) {
    const findFirstFn = this.model.findFirst<ModelFindFirstArgs>
    const args = options ? Object.assign({ where }, options) : { where }
    return findFirstFn(args) as Prisma.PrismaPromise<
      FactoryResult<M, K, 'findFirst'>
    >
  }

  async findFirstOrThrow<
    T extends TypeMapArgs<M, 'findFirstOrThrow', ArgsExtension>['where'],
    K extends Omit<TypeMapArgs<M, 'findFirstOrThrow', ArgsExtension>, 'where'>
  >(
    where?: Prisma.SelectSubset<
      T,
      NonNullable<TypeMapArgs<M, 'findFirstOrThrow', ArgsExtension>['where']>
    >,
    options?: Prisma.SelectSubset<
      K,
      Omit<TypeMapArgs<M, 'findFirstOrThrow', ArgsExtension>, 'where'>
    >
  ) {
    const findFirstOrThrowFn = this.model.findFirstOrThrow<ModelFindFirstArgs>
    const args = options ? Object.assign({ where }, options) : { where }
    return (await findFirstOrThrowFn(args)) as FactoryResult<
      M,
      K,
      'findFirstOrThrow'
    >
  }

  async create<
    T extends TypeMapArgs<M, 'create', ArgsExtension>['data'],
    K extends Omit<TypeMapArgs<M, 'create', ArgsExtension>, 'data'>
  >(
    data: Prisma.SelectSubset<
      T,
      TypeMapArgs<M, 'create', ArgsExtension>['data']
    >,
    options?: Prisma.SelectSubset<
      K,
      Omit<TypeMapArgs<M, 'create', ArgsExtension>, 'data'>
    >
  ) {
    const createFn = this.model.create<ModelCreateArgs>
    const args = options ? Object.assign({ data }, options) : { data }
    return (await createFn(args)) as FactoryResult<M, K, 'create'>
  }

  async update<
    T extends TypeMapArgs<M, 'update', ArgsExtension>['data'],
    K extends Omit<TypeMapArgs<M, 'update', ArgsExtension>, 'data' | 'where'>
  >(
    id: TypeMapArgs<M, 'update', ArgsExtension>['where']['id'],
    data: Prisma.SelectSubset<
      T,
      TypeMapArgs<M, 'update', ArgsExtension>['data']
    >,
    options?: Prisma.SelectSubset<
      K,
      Omit<TypeMapArgs<M, 'update', ArgsExtension>, 'data' | 'where'>
    >
  ) {
    const updateFn = this.model.update<ModelUpdateArgs>
    const args = options
      ? Object.assign({ where: { id }, data }, options)
      : { where: { id }, data }
    return (await updateFn(args)) as FactoryResult<M, K, 'update'>
  }

  async delete<
    K extends Omit<TypeMapArgs<M, 'delete', ArgsExtension>, 'where'>
  >(
    id: TypeMapArgs<M, 'delete', ArgsExtension>['where']['id'],
    options?: Prisma.SelectSubset<
      K,
      Omit<TypeMapArgs<M, 'delete', ArgsExtension>, 'where'>
    >
  ) {
    const deleteFn = this.model.delete<ModelDeleteArgs>
    const args = options
      ? Object.assign({ where: { id } }, options)
      : { where: { id } }
    return (await deleteFn(args)) as FactoryResult<M, K, 'delete'>
  }
}
