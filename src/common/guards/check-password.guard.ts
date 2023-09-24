import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { compare } from 'bcryptjs'
import { UserResponseEntity } from '../../modules/users/entities/user.entity'
import { UsersRepository } from '../../modules/users/repositories/users.repository'
import { IS_PASSWORD_CHECK_REQUIRED } from '../decorators/check-password.decorator'
import { InvalidCredentialUnauthorizedError } from '../errors/unauthorized/InvalidCredentialUnauthorized.error'

@Injectable()
export class CheckPasswordGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersRepository: UsersRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirePasswordCheck: boolean =
      this.reflector.getAllAndOverride<boolean>(IS_PASSWORD_CHECK_REQUIRED, [
        context.getHandler(),
        context.getClass()
      ])

    if (!requirePasswordCheck) {
      return true
    }

    const request: any = context.switchToHttp().getRequest()

    await this.validate(this.extract(request), request.raw.url)

    return true
  }

  async validate(
    data: { sub: string; password: string },
    url: string
  ): Promise<void> {
    const user: UserResponseEntity = await this.usersRepository.findOneWhere({
      deletedAt: null,
      disabledAt: url.includes('users/enable') ? undefined : null
    })

    if (!user) {
      throw new InvalidCredentialUnauthorizedError()
    }

    const passwordValid: boolean = await compare(
      data.password,
      user.passwordHash
    )

    if (!passwordValid) {
      throw new InvalidCredentialUnauthorizedError()
    }

    return
  }

  extract(req: any) {
    try {
      const validateCredential: boolean =
        !req.user.sign.sub || !req.body.password

      if (validateCredential) {
        throw new InvalidCredentialUnauthorizedError()
      }

      return { sub: req.user.sign.sub, password: req.body.password }
    } catch (err) {
      Logger.error(err)

      throw new InvalidCredentialUnauthorizedError()
    }
  }
}
