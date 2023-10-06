import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { EmailService } from './email.service'

@Module({
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
