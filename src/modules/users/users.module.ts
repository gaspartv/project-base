import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { PassTokensModule } from '../pass-tokens/pass-tokens.module'
import { UsersPrismaRepository } from './repositories/prisma/users.prisma.repository'
import { UsersRepository } from './repositories/users.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [PrismaModule, PassTokensModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UsersRepository, useClass: UsersPrismaRepository }
  ],
  exports: [UsersRepository]
})
export class UsersModule {}
