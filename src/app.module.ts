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
import { JwtGuard } from './common/guards/jwt.guard'
import { RefreshTokenMiddleware } from './common/middlewares/refresh-token.middleware'
import { JwtStrategy } from './common/strategies/jwt.strategy'
import { PrismaModule } from './config/prisma/prisma.module'
import { RedisModule } from './config/redis/redis.module'
import { AuthModule } from './modules/auth/auth.module'
import { PassTokensModule } from './modules/pass-tokens/pass-tokens.module'
import { PassTokensService } from './modules/pass-tokens/pass-tokens.service'
import { SessionsModule } from './modules/sessions/sessions.module'
import { UsersModule } from './modules/users/users.module'

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
    PassTokensModule
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
