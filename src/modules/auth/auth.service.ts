import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { GeneratorDate } from '../../common/utils/generator-date'
import { UserResponseEntity } from '../../modules/users/entities/user.entity'
import {
  SessionEntity,
  SessionResponseEntity
} from '../sessions/entities/session.entity'
import { SessionsRepository } from '../sessions/repositories/sessions.repository'
import { UsersService } from '../users/users.service'
import { AuthResponseDto } from './dto/auth-response.dto'
import { MessageDto } from './dto/message.dto'
import { IJwtPayload } from './interfaces/payload.interface'
import { AuthRepository } from './repositories/auth.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionsRepository: SessionsRepository,
    private readonly repository: AuthRepository,
    private readonly usersService: UsersService
  ) {}

  async login(user: UserResponseEntity): Promise<AuthResponseDto> {
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

    return AuthResponseDto.handle({
      token,
      user
    })
  }

  async logout(userId: string): Promise<MessageDto> {
    await this.sessionsRepository.disconnectedMany(userId)

    return { message: 'logout successfully' }
  }

  async validateUser(
    login: string,
    password: string
  ): Promise<UserResponseEntity> {
    const user: UserResponseEntity = await this.repository.findOneUser(login)

    if (!user) {
      throw new UnauthorizedException('login unauthorized')
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

    throw new UnauthorizedException('login unauthorized')
  }
}
