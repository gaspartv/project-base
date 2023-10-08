import { ConflictException, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalGuard extends AuthGuard('local-all') {
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
