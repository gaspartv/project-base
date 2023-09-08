import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function documentBuilder(app: NestFastifyApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('MIT Universe API')
    .setDescription('API para o sistema MIT Universe')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)
}
