import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { JwtService } from '@nestjs/jwt/dist/jwt.service'
import { compare } from 'bcryptjs'
import { LoginUnauthorizedError } from '../../common/errors/unauthorized/LoginUnauthorized.error'
import { expiresAtGenerator } from '../../common/utils/expires-generator.util'
import { UserEntity } from '../../modules/users/entities/user.entity'
import {
  SessionEntity,
  SessionResponseEntity
} from '../sessions/entities/session.entity'
import { SessionsRepository } from '../sessions/repositories/sessions.repository'
import { UsersService } from '../users/users.service'
import { TokenResponseDto } from './dto/auth-response.dto'
import { MessageDto } from './dto/message.dto'
import { IPayload } from './interfaces/payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersService: UsersService
  ) {}

  async login(user: UserEntity): Promise<TokenResponseDto> {
    const expiresAt: Date = expiresAtGenerator()

    const entity: SessionEntity = new SessionEntity({
      userId: user.id,
      expiresAt: expiresAt,
      tokens: []
    })

    await this.sessionsRepository.disconnectedMany(user.id)

    const session: SessionResponseEntity =
      await this.sessionsRepository.create(entity)

    const payload: IPayload = {
      sign: {
        sub: user.id,
        sessionId: session.id
      }
    }

    return {
      token: this.jwtService.sign(payload)
    }
  }

  async logout(userId: string): Promise<MessageDto> {
    await this.sessionsRepository.disconnectedMany(userId)

    return { message: 'logout successfully' }
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user: UserEntity = await this.usersService.findOneWhere({
      email: email,
      deletedAt: null,
      disabledAt: null
    })

    if (!user) {
      throw new LoginUnauthorizedError()
    }

    return await this.validate(user, password)
  }

  private async validate<T extends { passwordHash: string }>(
    user: T,
    password: string
  ): Promise<T> {
    if (user) {
      const isPasswordValid = await compare(password, user.passwordHash)

      if (isPasswordValid) {
        return {
          ...user,
          passwordHash: undefined
        }
      }
    }

    throw new LoginUnauthorizedError()
  }
}
