import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { PassportStrategy } from '@nestjs/passport/dist/passport/passport.strategy'
import { Strategy } from 'passport-local'
import { AuthService } from '../../modules/auth/auth.service'
import { UserEntity } from '../../modules/users/entities/user.entity'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local-all') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  validate(email: string, password: string): Promise<UserEntity> {
    return this.authService.validateUser(email, password)
  }
}
