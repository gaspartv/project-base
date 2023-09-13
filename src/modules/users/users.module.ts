import { Module } from '@nestjs/common'
import { PrismaModule } from '../../recipes/prisma/prisma.module'
import { PrismaService } from '../../recipes/prisma/prisma.service'
import { RedisModule } from '../../recipes/redis/redis.module'
import { UsersPrismaRepository } from './repositories/prisma/users.prisma.repository'
import { UsersRedisRepository } from './repositories/redis/users.redis.repository'
import { UsersRepository } from './repositories/users.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    UsersPrismaRepository,
    { provide: UsersRepository, useClass: UsersRedisRepository }
  ],
  exports: [UsersService, UsersRepository]
})
export class UsersModule {}
