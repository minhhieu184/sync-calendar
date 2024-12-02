import { AxiosModule } from '@config/axios/axios.module'
import { EnvironmentModule } from '@config/environment'
import { CalendarModule } from '@model/calendar/calendar.module'
import { GoogleModule } from '@model/google/google.module'
import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
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
    /** MODEL */
    GoogleModule,
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
