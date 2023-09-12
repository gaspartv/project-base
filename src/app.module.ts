import { BullModule } from '@nestjs/bull'
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
import { SessionsModule } from './modules/sessions/sessions.module'
import { UsersModule } from './modules/users/users.module'
import { JwtGuard } from './recipes/passport-auth/guards/jwt.guard'
import { JwtStrategy } from './recipes/passport-auth/strategies/jwt.strategy'
import { PrismaModule } from './recipes/prisma/prisma.module'
import { RedisModule } from './recipes/redis/redis.module'

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379
      }
    }),
    ThrottlerModule.forRoot(),
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
    SessionsModule
  ],
  providers: [
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
