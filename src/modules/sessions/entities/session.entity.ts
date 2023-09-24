import { randomUUID } from 'crypto'

export class SessionEntity {
  constructor(session: SessionEntity) {
    this.id = session.id || randomUUID()
    this.connectedAt = session.connectedAt || new Date()
    this.disconnectedAt = session.disconnectedAt || null
    this.expiresAt = session.expiresAt
    this.tokens = session.tokens
    this.userId = session.userId
  }

  id?: string
  connectedAt?: Date
  disconnectedAt?: Date | null
  expiresAt: Date
  tokens: string[]
  userId: string
}

export class SessionResponseEntity {
  constructor(session: SessionEntity) {
    this.id = session.id
    this.connectedAt = session.connectedAt
    this.disconnectedAt = session.disconnectedAt
    this.expiresAt = session.expiresAt
    this.tokens = session.tokens
    this.userId = session.userId
  }

  id: string
  connectedAt: Date
  disconnectedAt: Date | null
  expiresAt: Date
  tokens: string[]
  userId: string
}
