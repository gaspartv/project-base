import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { PassportStrategy } from '@nestjs/passport'
import 'dotenv/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { IJwtPayload } from '../interfaces/jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-all') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate(payload: IJwtPayload): Promise<IJwtPayload> {
    const { sign } = payload

    return { sign }
  }
}
