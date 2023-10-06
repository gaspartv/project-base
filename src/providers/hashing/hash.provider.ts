import { ConflictException } from '@nestjs/common/exceptions/conflict.exception'
import { Logger } from '@nestjs/common/services/logger.service'
import { compareSync, hashSync } from 'bcryptjs'

export class HashProvider {
  static passwordHash(password: string): string {
    const isDevelopment = process.env.NODE_ENV === 'dev'

    if (isDevelopment) {
      Logger.log({ password })
    }

    const salt: number = Number(process.env.HASH_SALT)

    return hashSync(password, salt)
  }

  static passwordIsMatch(string: string, hash: string): void {
    const isMatch: boolean = compareSync(string, hash)

    if (isMatch) {
      throw new ConflictException('password is match')
    }
  }
}
