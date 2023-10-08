import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception'
import { PassportStrategy } from '@nestjs/passport'
import { compare } from 'bcryptjs'
import { Strategy } from 'passport-local'
import {
  UserEntity,
  UserResponseEntity
} from '../../users/entities/user.entity'
import { UsersRepository } from '../../users/repositories/users.repository'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local-auth') {
  constructor(private readonly usersRepository: UsersRepository) {
    super({ usernameField: 'login' })
  }

  async validate(login: string, password: string): Promise<UserEntity> {
    const user: UserResponseEntity =
      await this.usersRepository.findOneByLogin(login)

    if (!user) throw new UnauthorizedException('login unauthorized')

    const isPasswordValid: boolean = await compare(password, user.passwordHash)

    if (!isPasswordValid) throw new UnauthorizedException('login unauthorized')

    return user
  }
}
