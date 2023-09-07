import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { load } from './config/env/load'
import { validate } from './config/env/validate'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load,
      validate,
      validationOptions: { allowUnknown: false },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
