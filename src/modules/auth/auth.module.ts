import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from '../../common/strategies/local.strategy'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { SessionsModule } from '../../modules/sessions/sessions.module'
import { UsersModule } from '../../modules/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-all' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
    }),
    PrismaModule,
    UsersModule,
    SessionsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [PassportModule, AuthService]
})
export class AuthModule {}
