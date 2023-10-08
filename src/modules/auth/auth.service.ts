import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { JwtService } from '@nestjs/jwt'
import { MessageDto } from '../../common/dto/message.dto'
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface'
import { GeneratorDate } from '../../common/utils/generator-date'
import { UserResponseEntity } from '../../modules/users/entities/user.entity'
import {
  SessionEntity,
  SessionResponseEntity
} from '../sessions/entities/session.entity'
import { SessionsRepository } from '../sessions/repositories/sessions.repository'
import { ResponseLoginDto } from './dto/response/response-login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionsRepository: SessionsRepository
  ) {}

  async login(user: UserResponseEntity): Promise<ResponseLoginDto> {
    const expiresAt: Date = GeneratorDate.expiresAt()

    const entity: SessionEntity = new SessionEntity({
      userId: user.id,
      expiresAt,
      tokens: []
    })

    await this.sessionsRepository.disconnectedMany(user.id)

    const session: SessionResponseEntity =
      await this.sessionsRepository.create(entity)

    const payload: IJwtPayload = {
      sign: {
        sub: user.id,
        sessionId: session.id
      }
    }

    const token: string = this.jwtService.sign(payload)

    return ResponseLoginDto.handle({
      token,
      user
    })
  }

  async logout(userId: string): Promise<MessageDto> {
    await this.sessionsRepository.disconnectedMany(userId)

    return { message: 'logout successfully' }
  }
}
