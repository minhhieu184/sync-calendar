import { ConfidentialClientApplication, LogLevel } from '@azure/msal-node'
import { Client } from '@microsoft/microsoft-graph-client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MSAuthService {
  client: Client

  constructor() {
    // Create msal application object
    const msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.OAUTH_CLIENT_ID || '',
        authority: `${process.env.OAUTH_AUTHORITY}/${process.env.OAUTH_TENANT_ID}`,
        clientSecret: process.env.OAUTH_CLIENT_SECRET
      },
      system: {
        loggerOptions: {
          loggerCallback(logLevel, message, containsPii) {
            console.log(message)
          },
          piiLoggingEnabled: false,
          logLevel: LogLevel.Error
        }
      }
    })

    this.client = Client.init({
      // Implement an auth provider that gets a token
      // from the app's MSAL instance
      authProvider: async (done) => {
        try {
          // Get a token using client credentials
          const response = await msalClient.acquireTokenByClientCredential({
            scopes: [
              'https://graph.microsoft.com/.default'
              // 'https://graph.microsoft.com/User.Read.All'
            ]
          })
          if (!response) return done(new Error('Error: No response'), null)
          // First param to callback is the error,
          // Set to null in success case
          done(null, response.accessToken)
        } catch (err) {
          console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)))
          done(err, null)
        }
      }
    })
  }
}
