import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvironmentVariables, NodeEnvironment } from './load'

@Injectable()
export class Env {
  constructor(private readonly configService: ConfigService) {}

  private get env() {
    return this.configService.get<EnvironmentVariables>('environments')
  }

  get hash() {
    return {
      salt: this.env.HASH_SALT,
    }
  }

  get db() {
    return {
      url: this.env.DATABASE_URL,
    }
  }

  get jwt() {
    return {
      secret: this.env.JWT_SECRET,
      expiresIn: this.env.JWT_EXPIRES_IN,
    }
  }

  get port() {
    return this.env.PORT_BACKEND
  }

  get nodeEnv() {
    return this.env.NODE_ENV
  }

  isDevelopment() {
    return this.env.NODE_ENV === NodeEnvironment.DEVELOPMENT
  }

  isProduction() {
    return this.env.NODE_ENV === NodeEnvironment.PRODUCTION
  }

  isTest() {
    return this.env.NODE_ENV === NodeEnvironment.TEST
  }
}
