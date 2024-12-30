// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createDecipheriv, createHmac, privateDecrypt } from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * @param  {string} keyPath - The relative path to the file containing the private key
 * @returns {string} Contents of the private key file
 */
function getPrivateKey(keyPath: string) {
  const key = readFileSync(join(process.cwd(), keyPath), 'utf8')
  return key
}

/**
 * Gets the certificate contents from the certificate file
 * @param  {string} certPath = The relative path to the certificate
 * @returns {string} The contents of the certificate
 */
function getSerializedCertificate(certPath: string) {
  const cert = readFileSync(join(process.cwd(), certPath))
  // Remove the markers from the string, leaving just the certificate
  return cert
    .toString()
    .replace(/(\r\n|\n|\r|-|BEGIN|END|CERTIFICATE|\s)/gm, '')
}

/**
 * Decrypts the encrypted symmetric key sent by Microsoft Graph
 * @param  {string} encodedKey - A base64 string containing an encrypted symmetric key
 * @param  {string} keyPath - The relative path to the private key file to decrypt with
 * @returns {Buffer} The decrypted symmetric key
 */
function decryptSymmetricKey(encodedKey: string, keyPath: string) {
  const asymmetricKey = getPrivateKey(keyPath)
  const encryptedKey = Buffer.from(encodedKey, 'base64')
  const decryptedSymmetricKey = privateDecrypt(asymmetricKey, encryptedKey)
  return decryptedSymmetricKey
}

/**
 * Decrypts the payload data using the one-time use symmetric key
 * @param  {string} encryptedPayload - The base64-encoded encrypted payload
 * @param  {Buffer} symmetricKey - The one-time use symmetric key sent by Microsoft Graph
 * @returns {string} - The decrypted payload
 */
function decryptPayload(encryptedPayload: string, symmetricKey: Buffer) {
  // Copy the initialization vector from the symmetric key
  const iv = Buffer.alloc(16, 0)
  symmetricKey.copy(iv, 0, 0, 16)

  // Create a decipher object
  const decipher = createDecipheriv('aes-256-cbc', symmetricKey, iv)

  // Decrypt the payload
  let decryptedPayload = decipher.update(encryptedPayload, 'base64', 'utf8')
  decryptedPayload += decipher.final('utf8')
  return decryptedPayload
}

/**
 * @param  {string} encodedSignature - The base64-encoded signature
 * @param  {string} signedPayload - The base64-encoded signed payload
 * @param  {Buffer} symmetricKey - The one-time use symmetric key
 * @returns {boolean} - True if signature is valid, false if invalid
 */
function verifySignature(
  encodedSignature: string,
  signedPayload: string,
  symmetricKey: Buffer
) {
  const hmac = createHmac('sha256', symmetricKey)
  hmac.write(signedPayload, 'base64')
  return encodedSignature === hmac.digest('base64')
}

export const certHelper = {
  getSerializedCertificate,
  decryptSymmetricKey,
  decryptPayload,
  verifySignature
}
