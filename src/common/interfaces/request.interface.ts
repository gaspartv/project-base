import { FastifyRequest } from 'fastify'
import { UserResponseEntity } from '../../modules/users/entities/user.entity'

export interface IRequest extends FastifyRequest {
  user: UserResponseEntity
}
