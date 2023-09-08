import { ELanguage } from '@prisma/client'

export class UserEntity {
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
