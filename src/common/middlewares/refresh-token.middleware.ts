import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction } from 'express'
import { FastifyReply } from 'fastify'
import { IPayload } from '../../modules/auth/interfaces/payload.interface'
import { IRequest } from '../../modules/auth/interfaces/request.interface'
import {
  SessionEntity,
  SessionResponseEntity
} from '../../modules/sessions/entities/session.entity'
import { SessionsRepository } from '../../modules/sessions/repositories/sessions.repository'
import { UserEntity } from '../../modules/users/entities/user.entity'
import { UsersRepository } from '../../modules/users/repositories/users.repository'
import { InvalidTokenUnauthorizedError } from '../errors/unauthorized/InvalidTokenUnauthorized.error'
import { expiresAtGenerator } from '../utils/expires-generator.util'

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository
  ) {}

  async use(
    req: IRequest,
    res: FastifyReply,
    next: NextFunction
  ): Promise<void> {
    if (req.headers.authorization) {
      const token: string = req.headers.authorization.split('Bearer ')[1]

      if (!token) {
        throw new InvalidTokenUnauthorizedError()
      }

      const decoded: any = this.jwtService.decode(token)

      const validateDecoded =
        !decoded ||
        !decoded.sign ||
        !decoded.sign.sessionId ||
        !decoded.sign.sub

      if (validateDecoded) {
        throw new InvalidTokenUnauthorizedError()
      }

      const user: UserEntity = await this.usersRepository.findOneWhere({
        id: decoded.sign.sub,
        deletedAt: null,
        disabledAt: null
      })

      if (!user) {
        throw new InvalidTokenUnauthorizedError()
      }

      const session: SessionResponseEntity =
        await this.sessionsRepository.findOne(decoded.sign.sessionId)

      if (!session) {
        throw new InvalidTokenUnauthorizedError()
      }

      if (session.disconnectedAt !== null) {
        throw new InvalidTokenUnauthorizedError()
      }

      if (session.tokens.includes(token)) {
        throw new InvalidTokenUnauthorizedError()
      }

      const validateDate: boolean =
        Number(new Date().getTime()) >=
        Number(new Date(session.expiresAt).getTime())

      if (validateDate) {
        const expiresAt = expiresAtGenerator()

        const payload: IPayload = {
          sign: {
            sub: session.userId,
            sessionId: session.id
          }
        }

        const newToken: string = this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET
        })

        req.headers.authorization = `Bearer ${newToken}`

        const entity: SessionEntity = new SessionEntity({
          ...session,
          expiresAt,
          tokens: [...session.tokens, token]
        })

        await this.sessionsRepository.update(session.id, entity)
      }
    }

    next()
  }
}
