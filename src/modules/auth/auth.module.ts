import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { SessionsModule } from '../../modules/sessions/sessions.module'
import { UsersModule } from '../../modules/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [UsersModule, SessionsModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
