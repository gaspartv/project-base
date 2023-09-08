import { Catch, ExecutionContext, HttpServer, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { FastifyReply } from 'fastify'

export type ErrorCodesStatusMapping = {
  [key: string]: number
}

@Catch(Prisma?.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
    P2010: HttpStatus.BAD_REQUEST
  }

  constructor(
    applicationRef?: HttpServer,
    errorCodesStatusMapping?: ErrorCodesStatusMapping
  ) {
    super(applicationRef)

    if (errorCodesStatusMapping) {
      this.errorCodesStatusMapping = Object.assign(
        this.errorCodesStatusMapping,
        errorCodesStatusMapping
      )
    }
  }

  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ExecutionContext
  ) {
    const ctx = host.switchToHttp()
    const response: FastifyReply = ctx.getResponse<FastifyReply>()
    const error = exception as Prisma.PrismaClientKnownRequestError

    const statusCode = this.getHttpStatus(error.code)

    response.status(statusCode).send({
      statusCode,
      timestamp: new Date().toISOString(),
      message: error.message
    })
  }

  private getHttpStatus(errorCode: string): number {
    return (
      this.errorCodesStatusMapping[errorCode] ||
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
