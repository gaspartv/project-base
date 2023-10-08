import { Module } from '@nestjs/common'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { RedisModule } from '../../config/redis/redis.module'
import { PassTokensModule } from '../pass-tokens/pass-tokens.module'
import { UsersPrismaRepository } from './repositories/prisma/users.prisma.repository'
import { UsersRedisRepository } from './repositories/redis/users.redis.repository'
import { UsersRepository } from './repositories/users.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { UsersUseCase } from './users.use-case'

@Module({
  imports: [PrismaModule, RedisModule, PassTokensModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersUseCase,
    UsersPrismaRepository,
    { provide: UsersRepository, useClass: UsersRedisRepository }
  ],
  exports: [UsersRepository, UsersService]
})
export class UsersModule {}
