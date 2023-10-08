import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception'
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalGuard extends AuthGuard('local-auth') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw new ConflictException(err?.message)
    }

    return user
  }
}
