import { SessionNotFoundError } from '../../../../common/errors/not-found/SessionNotFound.error'
import {
  SessionEntity,
  SessionResponseEntity
} from '../../entities/session.entity'
import { SessionsRepository } from '../sessions.repository'

export class SessionsFakeRepository implements SessionsRepository {
  private sessions: SessionResponseEntity[] = []
  async create(entity: SessionEntity): Promise<SessionResponseEntity> {
    const sessionCreate = new SessionResponseEntity(entity)

    this.sessions.push(sessionCreate)

    return sessionCreate
  }

  async update(
    id: string,
    entity: SessionEntity
  ): Promise<SessionResponseEntity> {
    const sessionFoundIndex = this.sessions.findIndex(
      (session) => session.id === id
    )
    const sessionEdit = new SessionResponseEntity(entity)

    this.sessions[sessionFoundIndex] = sessionEdit

    return sessionEdit
  }

  async findOne(id: string): Promise<SessionResponseEntity> {
    const sessionFound = this.sessions.find((session) => session.id === id)

    if (!sessionFound) {
      throw new SessionNotFoundError()
    }

    return new SessionResponseEntity(sessionFound)
  }

  async disconnectedMany(userId: string): Promise<{ count: number }> {
    const sessions = this.sessions.filter(
      (el) => el.userId === userId && el.disconnectedAt === null
    )

    for await (const session of sessions) {
      const sessionIndex = this.sessions.findIndex((el) => el.id === session.id)

      this.sessions[sessionIndex] = {
        ...session,
        disconnectedAt: new Date()
      }
    }

    return { count: sessions.length }
  }
}
