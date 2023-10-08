import { ELanguage, EUserPolice } from '@prisma/client'
import { randomUUID } from 'crypto'
import { HashProvider } from '../../../providers/hashing/hash.provider'
import { SessionEntity } from '../../sessions/entities/session.entity'

class User {
  id?: string
  disabledAt?: Date | null
  deletedAt?: Date | null
  updatedAt?: Date
  firstName: string
  lastName: string
  email: string
  login: string
  phone: string
  cpf: string
  password?: string
  passwordHash?: string
  description?: string | null
  imageUri?: string | null
  darkMode?: boolean
  language?: ELanguage
  police?: EUserPolice
}

export class UserEntity {
  constructor(user: User) {
    this.id = user.id || randomUUID()
    this.createdAt = new Date()
    this.updatedAt = user.updatedAt || new Date()
    this.disabledAt = user.disabledAt || null
    this.deletedAt = user.deletedAt || null
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.login = user.login
    this.phone = user.phone
    this.cpf = user.cpf
    this.passwordHash = user.password
      ? HashProvider.passwordHash(user.password)
      : user.passwordHash
    this.description = user.description || null
    this.imageUri = user.imageUri || null
    this.darkMode = user.darkMode || false
    this.language = user.language || ELanguage.PT_BR
    this.police = user.police || EUserPolice.NORMAL
  }

  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly disabledAt: Date | null
  readonly deletedAt: Date | null
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly login: string
  readonly phone: string
  readonly cpf: string
  readonly passwordHash: string
  readonly description?: string | null
  readonly imageUri?: string | null
  readonly darkMode: boolean
  readonly language: ELanguage
  readonly police: EUserPolice
}

export class UserResponseEntity {
  constructor(user: UserResponseEntity) {
    this.id = user.id
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
    this.disabledAt = user.disabledAt
    this.deletedAt = user.deletedAt
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.login = user.login
    this.phone = user.phone
    this.cpf = user.cpf
    this.passwordHash = user.passwordHash
    this.description = user.description
    this.imageUri = user.imageUri
    this.darkMode = user.darkMode
    this.language = user.language
    this.police = user.police
    this.Sessions = user.Sessions
  }

  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly disabledAt: Date | null
  readonly deletedAt: Date | null
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly login: string
  readonly phone: string
  readonly cpf: string
  readonly passwordHash: string
  readonly description: string | null
  readonly imageUri: string | null
  readonly darkMode: boolean
  readonly language: ELanguage
  readonly police: EUserPolice
  readonly Sessions: SessionEntity[]
}
