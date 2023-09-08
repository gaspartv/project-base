import { UseGuards, applyDecorators } from '@nestjs/common'
import { JwtGuard } from '../../recipes/passport-auth/guards/jwt.guard'

export function JwtAuth() {
  return applyDecorators(UseGuards(JwtGuard))
}
