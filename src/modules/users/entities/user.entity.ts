import { ELanguage } from '@prisma/client'

interface User {
  id: string
  createdAt: Date
  updatedAt: Date
  disabledAt: Date | null
  deletedAt: Date | null
  firstName: string
  lastName: string
  email: string
  phone: string
  passwordHash: string
  description: string | null
  imageUri: string | null
  darkMode: boolean
  language: ELanguage
}

export class UserEntity {
  constructor(user: User) {
    this.id = user.id
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
    this.disabledAt = user.disabledAt || null
    this.deletedAt = user.disabledAt || null
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.phone = user.phone
    this.passwordHash = user.passwordHash
    this.description = user.description || null
    this.imageUri = user.imageUri || null
    this.darkMode = user.darkMode
    this.language = user.language
  }

  id: string
  createdAt: Date
  updatedAt: Date
  disabledAt: Date | null
  deletedAt: Date | null
  firstName: string
  lastName: string
  email: string
  phone: string
  passwordHash: string
  description: string | null
  imageUri: string | null
  darkMode: boolean
  language: ELanguage
}
