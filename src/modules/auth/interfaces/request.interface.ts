import { FastifyRequest } from 'fastify'
import { UserResponseEntity } from '../../users/entities/user.entity'

export interface IRequest extends FastifyRequest {
  user: UserResponseEntity
}
