import { ELanguage } from '@prisma/client'
import { Exclude } from 'class-transformer'
import { randomUUID } from 'crypto'

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

  id?: string
  createdAt?: Date
  updatedAt?: Date
  disabledAt?: Date | null
  deletedAt?: Date | null
  firstName: string
  lastName: string
  email: string
  phone: string
  passwordHash: string
  description?: string | null
  imageUri?: string | null
  darkMode?: boolean
  language?: ELanguage
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
  }

  id: string
  createdAt: Date
  updatedAt: Date
  disabledAt: Date | null
  @Exclude() deletedAt: Date | null
  firstName: string
  lastName: string
  email: string
  phone: string
  @Exclude() passwordHash: string
  description: string | null
  imageUri: string | null
  darkMode: boolean
  language: ELanguage
}
