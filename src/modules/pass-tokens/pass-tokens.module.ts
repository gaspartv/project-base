import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { PassTokenRepository } from './repositories/pass-tokens.repository'
import { PassTokenPrismaRepository } from './repositories/prisma/pass-token.prisma.repository'

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: PassTokenRepository, useClass: PassTokenPrismaRepository }
  ],
  exports: [PassTokenRepository]
})
export class PassTokensModule {}
