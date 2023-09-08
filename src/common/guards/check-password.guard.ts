import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import { UserEntity } from '../../modules/users/entities/user.entity'
import { RedisService } from '../../recipes/redis/redis.service'
import { IS_PASSWORD_CHECK_REQUIRED } from '../decorators/check-password.decorator'

@Injectable()
export class CheckPasswordGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaClient,
    private readonly redis: RedisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirePasswordCheck = this.reflector.getAllAndOverride<boolean>(
      IS_PASSWORD_CHECK_REQUIRED,
      [context.getHandler(), context.getClass()]
    )

    if (!requirePasswordCheck) return true

    const request = context.switchToHttp().getRequest()

    await this.validate(this.extract(request), request.raw.url)

    return true
  }

  async validate(
    data: { sub: string; password: string },
    url: string
  ): Promise<void> {
    let user: UserEntity

    const cachedUser = await this.redis.get(data.sub)

    if (cachedUser) {
      const userCached: UserEntity = JSON.parse(cachedUser)

      if (userCached.deletedAt === null) {
        if (url.includes('users/enable')) {
          user = userCached
        }

        if (userCached.disabledAt === null) {
          user = userCached
        }
      }
    } else {
      user = await this.prisma.user.findUnique({
        where: {
          id: data.sub,
          deletedAt: null,
          disabledAt: url.includes('users/enable') ? undefined : null
        }
      })
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    const passwordValid = await compare(data.password, user.passwordHash)

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials.')
    }
  }

  extract(req: any) {
    try {
      if (!req.user.sign.sub || !req.body.password) {
        throw new UnauthorizedException('Invalid token.')
      }
      return { sub: req.user.sign.sub, password: req.body.password }
    } catch (error) {
      console.error(error)
      throw new ConflictException('Invalid credentials.')
    }
  }
}
