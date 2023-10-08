import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { IJwtRequest } from '../../interfaces/auth-jwt-request.interface'
import { ISign } from '../../interfaces/jwt-payload.interface'

export const Sign = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ISign => {
    const request = context.switchToHttp().getRequest<IJwtRequest>()

    return request.user.sign
  }
)
