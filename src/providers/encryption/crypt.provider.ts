import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes
} from 'crypto'

export class CryptService {
  static encryptionKey = pbkdf2Sync(
    process.env.ENCRYPTION_KEY,
    process.env.HASH_SALT,
    100000,
    32,
    'sha512'
  )

  static algorithm = process.env.ALGORITHM

  static encrypt(message: string): string {
    const iv = randomBytes(16)

    const cipher = createCipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey),
      iv
    )

    let encryptedMessage = cipher.update(message, 'utf8', 'hex')

    encryptedMessage += cipher.final('hex')

    return iv.toString('hex') + ':' + encryptedMessage
  }

  static decrypt(message: string): string {
    const [ivHex, encryptedMessage] = message.split(':')

    const iv = Buffer.from(ivHex, 'hex')

    const decipher = createDecipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey),
      iv
    )

    let decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8')

    return (decryptedMessage += decipher.final('utf8'))
  }
}
