import { Injectable } from '@nestjs/common'
import { Auth } from 'googleapis'

@Injectable()
export class GoogleAuth extends Auth.GoogleAuth {
  constructor() {
    super({ keyFile: 'credentials.json' })
  }
}
