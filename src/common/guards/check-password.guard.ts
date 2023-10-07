import { UnauthorizedException } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { CanActivate } from '@nestjs/common/interfaces/features/can-activate.interface'
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface'
import { Logger } from '@nestjs/common/services/logger.service'
import { Reflector } from '@nestjs/core/services/reflector.service'
import { compare } from 'bcryptjs'
import { UserEntity } from '../../modules/users/entities/user.entity'
import { UsersService } from '../../modules/users/users.service'
import { IS_PASSWORD_CHECK_REQUIRED } from '../decorators/custom/check-password.decorator'

@Injectable()
export class CheckPasswordGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService
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
    const user: UserEntity = await this.usersService.findOneWhere({
      deletedAt: null,
      disabledAt: url.includes('users/enable') ? undefined : null
    })

    if (!user) {
      throw new UnauthorizedException('invalid credentials')
    }

    const passwordValid: boolean = await compare(
      data.password,
      user.passwordHash
    )

    if (!passwordValid) {
      throw new UnauthorizedException('invalid credentials')
    }

    return
  }

  extract(req: any) {
    try {
      const validateCredential: boolean =
        !req.user.sign.sub || !req.body.password

      if (validateCredential) {
        throw new UnauthorizedException('invalid credentials')
      }

      return { sub: req.user.sign.sub, password: req.body.password }
    } catch (err) {
      Logger.error(err)

      throw new UnauthorizedException('invalid credentials')
    }
  }
}
