import { UseGuards, applyDecorators } from '@nestjs/common'
import { LocalGuard } from '../../modules/auth/guards/local.guard'

export function LocalAuth() {
  return applyDecorators(UseGuards(LocalGuard))
}
