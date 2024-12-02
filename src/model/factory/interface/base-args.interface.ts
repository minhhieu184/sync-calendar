import { TypeMapArgs } from '@model/prisma'
import { Model } from './factory.interface'

type AllOptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never
}[keyof T]

type AllNonOptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T]

/** Maintain key types, keep it's optional '?' */
type MaintainKey<T extends object> = {
  [K in AllNonOptionalKeys<T>]: any
} & {
  [K in AllOptionalKeys<T>]?: any
}

export type ModelFindManyArgs = MaintainKey<TypeMapArgs<Model, 'findMany'>>

export type ModelCountArgs = MaintainKey<TypeMapArgs<Model, 'count'>>

export type ModelFindUniqueArgs = MaintainKey<TypeMapArgs<Model, 'findUnique'>>

export type ModelFindFirstArgs = MaintainKey<TypeMapArgs<Model, 'findFirst'>>

export type ModelCreateArgs = MaintainKey<TypeMapArgs<Model, 'create'>>

export type ModelUpdateArgs = MaintainKey<TypeMapArgs<Model, 'update'>>

export type ModelDeleteArgs = MaintainKey<TypeMapArgs<Model, 'delete'>>
