import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { UserEntity } from '../../users/entities/user.entity'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local-all') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' })
  }

  validate(login: string, password: string): Promise<UserEntity> {
    return this.authService.validateUser(login, password)
  }
}
