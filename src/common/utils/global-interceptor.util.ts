import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Observable, map } from 'rxjs'

export interface Response<T> {
  data: T
}

@Injectable()
export class TransformationInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    const httpContext = context.switchToHttp()
    const response: FastifyReply = httpContext.getResponse<FastifyReply>()
    const request: FastifyRequest = httpContext.getRequest<FastifyRequest>()

    let token: string | null = null

    if (request.headers.authorization) {
      token = request.headers.authorization.split('Bearer ')[1]
    }

    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode: response.statusCode,
        method: httpContext.getRequest().method,
        timestamp: new Date().toISOString(),
        token
      }))
    )
  }
}
