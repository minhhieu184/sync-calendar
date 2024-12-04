import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { DEFAULT_RESPONSE } from '../constant'

@Catch()
export class GLobalFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(e: any, host: ArgumentsHost): void {
    console.log('GlobalFilter 📕📕📕:', e)
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const path = httpAdapter.getRequestUrl(ctx.getRequest())
    const timestamp = new Date().toISOString()

    httpAdapter.reply(
      ctx.getResponse(),
      {
        ...DEFAULT_RESPONSE,
        timestamp,
        path
      },
      500
    )
  }
}
