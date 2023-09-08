import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { expiresAtGenerator } from '../../common/utils/expires-generator.util'
import { UserEntity } from '../../modules/users/entities/user.entity'
import { PrismaService } from '../../recipes/prisma/prisma.service'
import { ResponseTokenDto } from './dto/auth-response.dto'
import { IPayload } from './interfaces/payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(user: UserEntity): Promise<ResponseTokenDto> {
    const expiresAt = expiresAtGenerator()

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        expiresAt
      }
    })

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

  async logout(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        userId,
        disconnectedAt: null
      },
      data: {
        disconnectedAt: new Date()
      }
    })

    return
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
        disabledAt: null
      }
    })

    if (!user) {
      throw new UnauthorizedException('email or password incorrect.')
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

    throw new UnauthorizedException('email or password incorrect.')
  }
}
