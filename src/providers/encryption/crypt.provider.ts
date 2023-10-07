import {
  Cipher,
  Decipher,
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes
} from 'crypto'
import 'dotenv'

export class CryptProvider {
  private static encryptionKey: Buffer = pbkdf2Sync(
    process.env.ENCRYPTION_KEY,
    process.env.HASH_SALT,
    100000,
    32,
    'sha512'
  )

  private static algorithm: string = process.env.ALGORITHM

  static encrypt(message: string): string {
    const iv: Buffer = randomBytes(16)

    const cipher: Cipher = createCipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey),
      iv
    )

    let encryptedMessage: string = cipher.update(message, 'utf8', 'hex')

    encryptedMessage += cipher.final('hex')

    return iv.toString('hex') + ':' + encryptedMessage
  }

  static decrypt(message: string): string {
    const [ivHex, encryptedMessage] = message.split(':')

    const iv: Buffer = Buffer.from(ivHex, 'hex')

    const decipher: Decipher = createDecipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey),
      iv
    )

    let decryptedMessage: string = decipher.update(
      encryptedMessage,
      'hex',
      'utf8'
    )

    return (decryptedMessage += decipher.final('utf8'))
  }
}
