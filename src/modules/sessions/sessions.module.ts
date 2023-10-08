import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { SessionsPrismaRepository } from './repositories/prisma/sessions.prisma.repository'
import { SessionsRepository } from './repositories/sessions.repository'

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: SessionsRepository, useClass: SessionsPrismaRepository }
  ],
  exports: [SessionsRepository]
})
export class SessionsModule {}
