import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import 'dotenv/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { IPayload } from '../../modules/auth/interfaces/payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-all') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate(payload: IPayload): Promise<IPayload> {
    const { sign } = payload

    return { sign }
  }
}