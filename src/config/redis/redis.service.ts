import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Logger } from '@nestjs/common/services/logger.service'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService extends Redis {
  constructor() {
    super({ db: 15 })

    super.on('error', (err) => {
      Logger.error('> Error on Redis.')
      Logger.error(err)
      process.exit(1)
    })

    super.on('connect', () => {
      Logger.log('> Redis connected.')
    })
  }

  async clean(prefixEntities: string): Promise<void> {
    let cursor: string = '0'
    const keysToDelete: string[] = []

    do {
      const [newCursor, keys] = await this.scan(
        cursor,
        'MATCH',
        prefixEntities + '*'
      )
      cursor = newCursor
      keysToDelete.push(...keys)
    } while (cursor !== '0')

    if (keysToDelete.length > 0) {
      await this.del(...keysToDelete)
    }

    return
  }
}
