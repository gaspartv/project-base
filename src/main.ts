import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { Logger, NestInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import fileUpload from 'fastify-file-upload'
import { AppModule } from './app.module'
import { TransformationInterceptor } from './common/utils/global-interceptor.util'
import { PrismaClientExceptionFilter } from './recipes/prisma/prisma.exception'
import { documentBuilder } from './recipes/swagger/document-builder'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  app.register(fileUpload, {
    limits: { fileSize: 1024 * 1024 * 5 },
    useTempFiles: true,
    tempFileDir: 'tmp',
    createParentPath: true,
    uriDecodeFileNames: true,
    safeFileNames: '/.(jpg|jpeg|png)$/i',
    preserveExtension: true
  })

  // COOKIE
  await app.register(fastifyCookie, { secret: 'api-tibia-info' })

  /// PROTEÇÃO PARA O CABEÇALHO DA APLICAÇÃO ///
  await app.register(helmet)

  /// TRATAMENTO DO CORS ///
  await app.register(cors)

  /// VALIDAÇÃO ///
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      transform: true,
      transformOptions: { groups: ['transform'] }
    })
  )

  const httpAdapter = app.getHttpAdapter()

  /// GLOBAL INTERCEPTORS ///
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
  app.useGlobalInterceptors(new TransformationInterceptor<NestInterceptor>())

  /// DOCUMENTAÇÃO ///
  documentBuilder(app)

  await app.listen(Number(process.env.PORT_BACKEND), '0.0.0.0', () =>
    Logger.log(`> Server start in port ${process.env.PORT_BACKEND}`)
  )
}
bootstrap()
