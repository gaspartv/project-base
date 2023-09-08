import {
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaClient } from '@prisma/client'
import { NextFunction } from 'express'
import { FastifyReply } from 'fastify'
import { IPayload } from '../../modules/auth/interfaces/payload.interface'
import { IRequest } from '../../modules/auth/interfaces/request.interface'
import { UserEntity } from '../../modules/users/entities/user.entity'
import { RedisService } from '../../recipes/redis/redis.service'
import { expiresAtGenerator } from '../utils/expires-generator.util'

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService
  ) {}

  async use(req: IRequest, res: FastifyReply, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split('Bearer ')[1]

      if (!token) {
        throw new UnauthorizedException('Invalid token.')
      }

      const decoded: any = this.jwtService.decode(token)

      if (
        !decoded ||
        !decoded.sign ||
        !decoded.sign.sessionId ||
        !decoded.sign.sub
      ) {
        throw new UnauthorizedException('Invalid token.')
      }
      let user: UserEntity

      const cachedUser = await this.redis.get(decoded.sign.sub)
      if (cachedUser) {
        const userCached: UserEntity = JSON.parse(cachedUser)

        if (userCached.deletedAt === null && userCached.disabledAt === null) {
          user = userCached
        }
      } else {
        user = await this.prisma.user.findUnique({
          where: { id: decoded.sign.sub, deletedAt: null, disabledAt: null }
        })
      }

      if (!user) {
        throw new UnauthorizedException('Invalid token.')
      }

      const session = await this.prisma.session.findUnique({
        where: { id: decoded.sign.sessionId }
      })

      if (!session) {
        throw new UnauthorizedException('Expired token.')
      }

      if (session.disconnectedAt !== null) {
        throw new UnauthorizedException('Expired token.')
      }

      if (session.tokens.includes(token)) {
        throw new UnauthorizedException('Expired token.')
      }

      if (Number(new Date().getTime()) >= Number(session.expiresAt.getTime())) {
        const expiresAt = expiresAtGenerator()

        const payload: IPayload = {
          sign: {
            sub: session.userId,
            sessionId: session.id
          }
        }

        const newToken = this.jwtService.sign(payload)

        req.headers.authorization = `Bearer ${newToken}`

        await this.prisma.session.update({
          where: { id: session.id },
          data: {
            expiresAt,
            tokens: [...session.tokens, token]
          }
        })
      }
    }

    next()
  }
}
