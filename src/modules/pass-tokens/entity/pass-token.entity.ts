import { randomUUID } from 'crypto'
import { UserEntity } from '../../users/entities/user.entity'

export class PassTokenEntity {
  constructor(dto: PassTokenEntity) {
    this.id = dto.id || randomUUID()
    this.createdAt = dto.createdAt || new Date()
    this.updatedAt = dto.updatedAt || new Date()
    this.expiresAt = dto.expiresAt
    this.revokedAt = dto.revokedAt || null
    this.usedAt = dto.usedAt || null
    this.userId = dto.userId
  }

  id?: string
  createdAt?: Date
  updatedAt?: Date
  expiresAt: Date
  revokedAt?: Date | null
  usedAt?: Date | null
  userId: string
}

export class ResponsePassTokenEntity {
  constructor(dto: ResponsePassTokenEntity) {
    this.id = dto.id
    this.createdAt = dto.createdAt
    this.updatedAt = dto.updatedAt
    this.expiresAt = dto.expiresAt
    this.revokedAt = dto.revokedAt
    this.usedAt = dto.usedAt
    this.userId = dto.userId
    this.User = dto.User
  }

  id: string
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  revokedAt: Date | null
  usedAt: Date | null
  userId: string

  User: UserEntity
}
