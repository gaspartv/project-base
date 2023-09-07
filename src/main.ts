import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      transform: true,
      transformOptions: { groups: ['transform'] },
    }),
  )

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('MIT Universe API')
    .setDescription('API para o sistema MIT Universe')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const port = app.get(ConfigService).get('PORT_BACKEND')

  await app.listen(port, '0.0.0.0', () =>
    new Logger().log(`Server start in port ${port}`),
  )
}
bootstrap()
