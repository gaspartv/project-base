import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { join } from 'path'
import { CheckPasswordGuard } from './common/guards/check-password.guard'
import { RefreshTokenMiddleware } from './common/middlewares/refresh-token.middleware'
import { AuthModule } from './modules/auth/auth.module'
import { PassTokensModule } from './modules/pass-tokens/pass-tokens.module'
import { PassTokensService } from './modules/pass-tokens/pass-tokens.service'
import { SessionsModule } from './modules/sessions/sessions.module'
import { UsersModule } from './modules/users/users.module'
import { EmailModule } from './recipes/email/email.module'
import { JwtGuard } from './recipes/passport-auth/guards/jwt.guard'
import { JwtStrategy } from './recipes/passport-auth/strategies/jwt.strategy'
import { PrismaModule } from './recipes/prisma/prisma.module'
import { RedisModule } from './recipes/redis/redis.module'

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 100 }
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationOptions: { allowUnknown: false }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'tmp')
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    SessionsModule,
    PassTokensModule,
    EmailModule
  ],
  providers: [
    PassTokensService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: CheckPasswordGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
    JwtStrategy,
    JwtService
  ],
  exports: [JwtStrategy]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('*')
  }
}
