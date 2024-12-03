import { Body, Controller, Headers, Post } from '@nestjs/common'

@Controller('webhook')
export class Webhook {
  @Post('google')
  async index(@Body() body: any, @Headers() headers: any) {
    console.log('EVENTTTTT')
    console.log('Webhook ~ index ~ headers:', headers)

    return 123
  }
}
