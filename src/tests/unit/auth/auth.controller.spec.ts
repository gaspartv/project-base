import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test } from '@nestjs/testing/test'
import { TestingModule } from '@nestjs/testing/testing-module'
import { PrismaModule } from '../../../config/prisma/prisma.module'
import { AuthController } from '../../../modules/auth/auth.controller'
import { AuthService } from '../../../modules/auth/auth.service'
import { LocalStrategy } from '../../../modules/auth/strategies/local.strategy'
import { SessionsModule } from '../../../modules/sessions/sessions.module'
import { UsersModule } from '../../../modules/users/users.module'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
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
      providers: [AuthService, LocalStrategy]
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
