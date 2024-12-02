import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './envSchema'

@Injectable()
export class EnvironmentService implements IEnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends keyof Env>(key: T): Env[T] {
    return this.configService.get(key) as Env[T]
  }

  getOrThrow<T extends keyof Env>(key: T): Env[T] {
    return this.configService.getOrThrow(key) as Env[T]
  }
}

export interface IEnvironmentService {
  get<T extends keyof Env>(key: T): Env[T]
  getOrThrow<T extends keyof Env>(key: T): Env[T]
}
