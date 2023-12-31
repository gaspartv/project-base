import {
  SessionEntity,
  SessionResponseEntity
} from '../entities/session.entity'

export abstract class SessionsRepository {
  abstract create(entity: SessionEntity): Promise<SessionResponseEntity>

  abstract update(
    id: string,
    entity: SessionEntity
  ): Promise<SessionResponseEntity>

  abstract findOneUnique(id: string): Promise<SessionResponseEntity>

  abstract findOneByUser(userId: string): Promise<SessionResponseEntity>

  abstract disconnectedMany(userId: string): Promise<{ count: number }>
}
