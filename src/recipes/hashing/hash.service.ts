import { ConflictException, Injectable, Logger } from '@nestjs/common'
import { compareSync, hashSync } from 'bcryptjs'

@Injectable()
export class HashService {
  passwordHash(password: string): string {
    const isDevelopment = process.env.NODE_ENV === 'dev'

    if (isDevelopment) {
      Logger.log({ password })
    }

    const salt: number = Number(process.env.HASH_SALT)

    return hashSync(password, salt)
  }

  passwordIsMatch(string: string, hash: string): void {
    const isMatch: boolean = compareSync(string, hash)

    if (isMatch) {
      throw new ConflictException('password is match')
    }
  }
}
