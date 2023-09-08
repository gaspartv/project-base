import { Injectable, Logger } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService extends Redis {
  constructor(private readonly logger: Logger) {
    super()

    super.on('error', (err) => {
      this.logger.error('Error on Redis.')
      this.logger.error(err)
      process.exit(1)
    })

    super.on('connect', () => {
      this.logger.log('Redis connected.')
    })
  }
}
