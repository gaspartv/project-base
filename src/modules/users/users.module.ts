import { Module } from '@nestjs/common'
import { PrismaModule } from '../../recipes/prisma/prisma.module'
import { RedisModule } from '../../recipes/redis/redis.module'
import { UsersPrismaRepository } from './repositories/prisma/users.prisma.repository'
import { UsersRedisRepository } from './repositories/redis/users.redis.repository'
import { UsersRepository } from './repositories/users.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { UsersUseCase } from './users.use-case'
import { CryptModule } from '../../recipes/crypt/crypt.module'

@Module({
  imports: [PrismaModule, RedisModule, CryptModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersUseCase,
    UsersPrismaRepository,
    { provide: UsersRepository, useClass: UsersRedisRepository }
  ],
  exports: [UsersService]
})
export class UsersModule {}
