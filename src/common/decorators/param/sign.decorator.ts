import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { IJwtRequest } from '../../../modules/auth/interfaces/auth-jwt-request.interface'
import { ISign } from '../../../modules/auth/interfaces/payload.interface'

export const Sign = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ISign => {
    const request = context.switchToHttp().getRequest<IJwtRequest>()

    return request.user.sign
  }
)
