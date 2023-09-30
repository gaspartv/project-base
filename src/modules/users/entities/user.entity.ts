import { ELanguage } from '@prisma/client'
import { randomUUID } from 'crypto'
import { SessionEntity } from '../../sessions/entities/session.entity'

export class UserEntity {
  constructor(user: UserEntity) {
    this.id = user.id || randomUUID()
    this.createdAt = user.createdAt || new Date()
    this.updatedAt = user.updatedAt || new Date()
    this.disabledAt = user.disabledAt || null
    this.deletedAt = user.disabledAt || null
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.phone = user.phone
    this.passwordHash = user.passwordHash
    this.description = user.description || null
    this.imageUri = user.imageUri || null
    this.darkMode = user.darkMode || false
    this.language = user.language || 'PT_BR'
  }

  readonly id?: string
  readonly createdAt?: Date
  readonly updatedAt?: Date
  readonly disabledAt?: Date | null
  readonly deletedAt?: Date | null
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly phone: string
  readonly passwordHash: string
  readonly description?: string | null
  readonly imageUri?: string | null
  readonly darkMode?: boolean
  readonly language?: ELanguage
}

export class UserResponseEntity {
  constructor(user: UserResponseEntity) {
    this.id = user.id
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
    this.disabledAt = user.disabledAt
    this.deletedAt = user.disabledAt
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.phone = user.phone
    this.passwordHash = user.passwordHash
    this.description = user.description
    this.imageUri = user.imageUri
    this.darkMode = user.darkMode
    this.language = user.language
    this.Session = user.Session
  }

  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly disabledAt: Date | null
  readonly deletedAt: Date | null
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly phone: string
  readonly passwordHash: string
  readonly description: string | null
  readonly imageUri: string | null
  readonly darkMode: boolean
  readonly language: ELanguage
  readonly Session: SessionEntity[]
}
