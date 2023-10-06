import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception'
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface'
import { Reflector } from '@nestjs/core/services/reflector.service'
import { AuthGuard } from '@nestjs/passport/dist/auth.guard'
import { IS_PUBLIC_KEY } from '../../../common/decorators/is-public.decorator'
import { UnauthorizedError } from '../../../common/errors/Unauthorized.error'

@Injectable()
export class JwtGuard extends AuthGuard('jwt-all') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    const canActivate = super.canActivate(context)

    if (typeof canActivate === 'boolean') {
      return canActivate
    }

    const canActivatePromise = canActivate as Promise<boolean>

    return canActivatePromise.catch((error) => {
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message)
      }

      throw new UnauthorizedException('You dont have permission to access.')
    })
  }
}
