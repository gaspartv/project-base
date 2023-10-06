import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { CryptModule } from '../../recipes/hashing/hash.module'
import { PrismaModule } from '../../recipes/prisma/prisma.module'
import { RedisModule } from '../../recipes/redis/redis.module'
import { PassTokensModule } from '../pass-tokens/pass-tokens.module'
import { UsersPrismaRepository } from './repositories/prisma/users.prisma.repository'
import { UsersRedisRepository } from './repositories/redis/users.redis.repository'
import { UsersRepository } from './repositories/users.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { UsersUseCase } from './users.use-case'

@Module({
  imports: [PrismaModule, RedisModule, CryptModule, PassTokensModule],
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
