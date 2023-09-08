import { UseGuards, applyDecorators } from '@nestjs/common'
import { LocalGuard } from '../../recipes/passport-auth/guards/local.guard'

export function LocalAuth() {
  return applyDecorators(UseGuards(LocalGuard))
}
