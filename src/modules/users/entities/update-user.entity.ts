import { ELanguage } from '@prisma/client'

interface User {
  firstName: string
  lastName: string
  email: string
  phone: string
  description?: string
  darkMode: boolean
  language: ELanguage
}

export class UpdateUserEntity {
  constructor(user: User) {
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.phone = user.phone
    this.description = user.description || null
    this.darkMode = user.darkMode
    this.language = user.language
  }

  firstName: string
  lastName: string
  email: string
  phone: string
  passwordHash: string
  description: string | null
  darkMode: boolean
  language: ELanguage
}
