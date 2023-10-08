import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { Logger } from '@nestjs/common/services/logger.service'
import { RedisService } from './redis.service'

@Module({
  providers: [RedisService, Logger],
  exports: [RedisService]
})
export class RedisModule {}
