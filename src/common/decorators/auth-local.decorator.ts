import { applyDecorators } from '@nestjs/common/decorators/core/apply-decorators'
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator'
import { LocalGuard } from '../../recipes/passport-auth/guards/local.guard'

export function LocalAuth() {
  return applyDecorators(UseGuards(LocalGuard))
}
