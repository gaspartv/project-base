import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SessionsModule } from '../../modules/sessions/sessions.module'
import { UsersModule } from '../../modules/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-all' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
    }),
    UsersModule,
    SessionsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [PassportModule, AuthService]
})
export class AuthModule {}
