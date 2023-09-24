import { Module } from '@nestjs/common'
import { PrismaModule } from '../../recipes/prisma/prisma.module'
import { RedisModule } from '../../recipes/redis/redis.module'
import { UsersModule } from '../users/users.module'
import { SessionsPrismaRepository } from './repositories/prisma/sessions.prisma.repository'
import { SessionsRedisRepository } from './repositories/redis/sessions.redis.repository'
import { SessionsRepository } from './repositories/sessions.repository'
import { SessionsService } from './sessions.service'

@Module({
  imports: [UsersModule, PrismaModule, RedisModule],
  providers: [
    SessionsService,
    SessionsPrismaRepository,
    { provide: SessionsRepository, useClass: SessionsRedisRepository }
  ],
  exports: [SessionsService, SessionsRepository]
})
export class SessionsModule {}
