import { NestFastifyApplication } from '@nestjs/platform-fastify/interfaces/nest-fastify-application.interface'
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder'
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module'

export function documentBuilder(app: NestFastifyApplication): void {
  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(process.env.DOC_TITLE)
    .setDescription(process.env.DOC_DESCRIPTION)
    .setVersion(process.env.DOC_VERSION)
    .build()

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)

  return
}
