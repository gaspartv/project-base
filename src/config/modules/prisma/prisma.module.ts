import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaService } from './prisma.service'

@Module({
  providers: [
    PrismaService,
    {
      provide: PrismaClient,
      useFactory: (prismaService: PrismaService) => prismaService.extends(),
      inject: [PrismaService],
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
