import {
  GetPublicKeyOrSecret,
  JwtHeader,
  SigningKeyCallback,
  verify
} from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'

// Configure JSON web key set client to get keys from well-known Microsoft identity endpoint
const client = new JwksClient({
  jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys'
})
/**
 * Gets the key specified in header
 * @param  {JwtHeader} header - The header containing the key ID
 * @param  {function} callback - The callback function
 */
const getKey: GetPublicKeyOrSecret = async (
  header: JwtHeader,
  callback: SigningKeyCallback
) => {
  try {
    const key = await client.getSigningKey(header.kid)
    const signingKey = key.getPublicKey()
    callback(null, signingKey)
  } catch (err: any) {
    callback(err, undefined)
  }
}

/**
 * Validates a token has a valid signature and has the expected audience and issuer
 * @param  {string} token - The token to verify
 * @param  {string} appId - The application ID expected in the audience claim
 * @param  {string} tenantId - The tenant ID expected in the issuer claim
 */
function isTokenValid(token: string, appId: string, tenantId: string) {
  return new Promise<boolean>((resolve) => {
    const options = {
      audience: [appId],
      issuer: [`https://sts.windows.net/${tenantId}/`]
    }
    verify(token, getKey, options, (err) => {
      if (err) {
        console.log(`Token validation error: ${err.message}`)
        resolve(false)
      }
      resolve(true)
    })
  })
}

export const tokenHelper = { isTokenValid }
