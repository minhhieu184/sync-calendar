import { AxiosModule } from '@config/axios/axios.module'
import { EnvironmentModule, EnvironmentService } from '@config/environment'
import { CalendarModule } from '@model/calendar/calendar.module'
import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ZodValidationPipe } from 'nestjs-zod'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    /** GLOBAL */
    // PrismaModule,
    AxiosModule,
    ServeStaticModule.forRoot({ rootPath: '/app/dist' }),
    EnvironmentModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (environment: EnvironmentService) => ({
        type: 'postgres',
        host: environment.get('POSTGRES_HOST'),
        port: environment.get('DB_FORWARD_PORT'),
        username: environment.get('POSTGRES_USER'),
        password: environment.get('POSTGRES_PASSWORD'),
        database: environment.get('POSTGRES_DB'),
        synchronize: false,
        entities: ['dist/**/entity/*.entity.{ts,js}'],
        migrations: ['dist/**/migration/**/*{.ts,.js}']
      })
    }),
    /** MODEL */
    CalendarModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe
    }
  ]
})
export class AppModule {}
