import { UseGuards, applyDecorators } from '@nestjs/common'
import { LocalGuard } from '../guards/local.guard'

export function LocalAuth() {
  return applyDecorators(UseGuards(LocalGuard))
}
