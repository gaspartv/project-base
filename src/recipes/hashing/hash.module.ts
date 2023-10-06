import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { HashService } from './hash.service'

@Module({
  imports: [],
  controllers: [],
  providers: [HashService],
  exports: [HashService]
})
export class CryptModule {}
