import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import {
  GLobalFilter,
  HTTPExceptionFilter,
  PrismaClientKnownRequestFilter,
  PrismaClientValidationFilter,
  ZodValidationExceptionFilter
} from './common'
import { AppModule } from './model/app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS
  app.enableCors({ origin: '*', credentials: true })

  // Set global prefix
  app.setGlobalPrefix('/api/v1')

  // Global filter
  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(
    new GLobalFilter(httpAdapterHost),
    new PrismaClientKnownRequestFilter(httpAdapterHost),
    new PrismaClientValidationFilter(httpAdapterHost),
    new HTTPExceptionFilter(httpAdapterHost),
    new ZodValidationExceptionFilter(httpAdapterHost)
  )
  await app.listen(process.env.PORT || '')
}
bootstrap()
