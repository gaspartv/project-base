import { User } from '@prisma/client'
import { FastifyRequest } from 'fastify'

export interface IRequest extends FastifyRequest {
  user: User
}
