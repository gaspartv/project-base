import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PrismaClient } from '@prisma/client'
import { PrismaService } from './prisma.service'

@Module({
  providers: [
    PrismaService,
    {
      provide: PrismaClient,
      useFactory: (prismaService: PrismaService) => prismaService.extends(),
      inject: [PrismaService]
    }
  ],
  exports: [PrismaClient, PrismaService]
})
export class PrismaModule {}
