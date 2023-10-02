import { Module } from '@nestjs/common'
import { EmailModule } from '../../recipes/email/email.module'
import { PrismaModule } from '../../recipes/prisma/prisma.module'
import { PassTokensService } from './pass-tokens.service'
import { PassTokenRepository } from './repositories/pass-tokens.repository'
import { PassTokenPrismaRepository } from './repositories/prisma/pass-token.prisma.repository'

@Module({
  imports: [PrismaModule, EmailModule],
  providers: [
    PassTokensService,
    { provide: PassTokenRepository, useClass: PassTokenPrismaRepository }
  ],
  exports: [PassTokensService, PassTokenRepository]
})
export class PassTokensModule {}
