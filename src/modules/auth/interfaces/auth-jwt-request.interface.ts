import { FastifyRequest } from 'fastify'
import { IApplication } from './payload.interface'

export interface IJwtRequest extends FastifyRequest {
  user: IApplication
}
