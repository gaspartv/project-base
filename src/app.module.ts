import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware/middleware-consumer.interface'
import { NestModule } from '@nestjs/common/interfaces/modules/nest-module.interface'
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe'
import { ConfigModule } from '@nestjs/config/dist/config.module'
import { APP_GUARD, APP_PIPE } from '@nestjs/core/constants'
import { JwtService } from '@nestjs/jwt/dist/jwt.service'
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module'
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard'
import { ThrottlerModule } from '@nestjs/throttler/dist/throttler.module'
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
