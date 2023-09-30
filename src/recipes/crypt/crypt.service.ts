import { Injectable, Logger } from '@nestjs/common'
import { hash } from 'bcryptjs'

@Injectable()
export class CryptService {
  async hashBcrypt(value: string): Promise<string> {
    if (process.env.NODE_ENV === 'dev') {
      Logger.log({ value })
    }

    return await hash(value, Number(process.env.HASH_SALT))
  }
}
