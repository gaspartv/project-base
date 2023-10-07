import {
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { FastifyReply } from 'fastify'
import { IPayload } from '../../modules/auth/interfaces/payload.interface'
import { IRequest } from '../../modules/auth/interfaces/request.interface'
import {
  SessionEntity,
  SessionResponseEntity
} from '../../modules/sessions/entities/session.entity'
import { SessionsRepository } from '../../modules/sessions/repositories/sessions.repository'
import { UserEntity } from '../../modules/users/entities/user.entity'
import { UsersService } from '../../modules/users/users.service'
import { GeneratorDate } from '../utils/generator-date'

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly sessionsRepository: SessionsRepository
  ) {}

  async use(
    req: IRequest,
    res: FastifyReply,
    next: (error?: any) => void
  ): Promise<void> {
    if (req.headers.authorization) {
      const token: string = req.headers.authorization.split('Bearer ')[1]

      if (!token) {
        throw new UnauthorizedException('invalid token')
      }

      const decoded: any = this.jwtService.decode(token)

      const validateDecoded: boolean =
        !decoded ||
        !decoded.sign ||
        !decoded.sign.sessionId ||
        !decoded.sign.sub

      if (validateDecoded) {
        throw new UnauthorizedException('invalid token')
      }

      const userId: string = decoded.sign.sub

      const user: UserEntity = await this.usersService.findOneWhere({
        id: userId,
        deletedAt: null,
        disabledAt: null
      })

      if (!user) {
        throw new UnauthorizedException('invalid token')
      }

      const session: SessionResponseEntity =
        await this.sessionsRepository.findOne(userId)

      const sessionValidate: boolean =
        !session ||
        session.disconnectedAt !== null ||
        session.tokens.includes(token)

      if (sessionValidate) {
        throw new UnauthorizedException('invalid token')
      }

      const validateDate: boolean =
        Number(new Date().getTime()) >=
        Number(new Date(session.expiresAt).getTime())

      if (validateDate) {
        const expiresAt: Date = GeneratorDate.expiresAt()

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
