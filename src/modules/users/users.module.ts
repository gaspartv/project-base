import { Module } from '@nestjs/common'
import { PrismaModule } from '../../recipes/prisma/prisma.module'
import { PrismaService } from '../../recipes/prisma/prisma.service'
import { UsersPrismaRepository } from './repositories/prisma/users.prisma.repository'
import { UsersRepository } from './repositories/users.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    { provide: UsersRepository, useClass: UsersPrismaRepository }
  ],
  exports: [UsersService]
})
export class UsersModule {}
