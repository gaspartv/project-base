import { FastifyRequest } from 'fastify'
import { IApplication } from './jwt-payload.interface'

export interface IJwtRequest extends FastifyRequest {
  user: IApplication
}
