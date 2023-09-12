import { ELanguage } from '@prisma/client'

interface User {
  id: string
  createdAt: Date
  updatedAt: Date
  disabledAt: Date | null
  firstName: string
  lastName: string
  email: string
  phone: string
  description: string | null
  imageUri: string | null
  darkMode: boolean
  language: ELanguage
}

export class ResponseUserEntity {
  constructor(user: User) {
    this.id = user.id
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
    this.disabledAt = user.disabledAt || null
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.phone = user.phone
    this.description = user.description || null
    this.imageUrl = user.imageUri
      ? `${process.env.URL_BACKEND}/tmp/avatar/${user.imageUri}`
      : null
    this.darkMode = user.darkMode
    this.language = user.language
  }

  id: string
  createdAt: Date
  updatedAt: Date
  disabledAt: Date | null
  firstName: string
  lastName: string
  email: string
  phone: string
  description: string | null
  imageUrl: string | null
  darkMode: boolean
  language: ELanguage
}
