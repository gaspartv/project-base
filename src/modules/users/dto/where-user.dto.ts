import { ELanguage } from '@prisma/client'

export class UserWhereDto {
  disabledAt?: Date | null
  deletedAt?: Date | null
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  imageUri?: string
  darkMode?: boolean
  language?: ELanguage
}
