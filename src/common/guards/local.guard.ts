import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception'
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface'
import { AuthGuard } from '@nestjs/passport/dist/auth.guard'

@Injectable()
export class LocalGuard extends AuthGuard('local-all') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new ConflictException(err?.message)
    }

    return user
  }
}
