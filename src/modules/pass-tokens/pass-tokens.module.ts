import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { PassTokensService } from './pass-tokens.service'
import { PassTokenRepository } from './repositories/pass-tokens.repository'
import { PassTokenPrismaRepository } from './repositories/prisma/pass-token.prisma.repository'

@Module({
  imports: [PrismaModule],
  providers: [
    PassTokensService,
    { provide: PassTokenRepository, useClass: PassTokenPrismaRepository }
  ],
  exports: [PassTokensService, PassTokenRepository]
})
export class PassTokensModule {}
