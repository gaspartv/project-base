import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { OnModuleInit } from '@nestjs/common/interfaces/hooks/on-init.interface'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.$connect()
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
  }

  extends() {
    return this.$extends({})
  }
}
