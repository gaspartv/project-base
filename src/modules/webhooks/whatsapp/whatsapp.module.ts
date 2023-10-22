import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PrismaModule } from '../../../config/prisma/prisma.module'
import { WhatsappController } from './whatsapp.controller'
import { WhatsappService } from './whatsapp.service'

@Module({
  imports: [PrismaModule],
  controllers: [WhatsappController],
  providers: [WhatsappService]
})
export class WhatsappModule {}
