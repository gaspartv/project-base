import { ELanguage } from '@prisma/client'
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

  static response(user: UserEntity): UserResponseEntity {
    return {
      id: user.id,
      disabledAt: user.disabledAt,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      description: user.description,
      imageUri: user.imageUri,
      darkMode: user.darkMode,
      language: user.language
    }
  }
}

export class UserResponseEntity {
  id: string
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

// export class UserResponseEntity {
//   constructor(user: UserResponseEntity) {
//     this.id = user.id
//     this.createdAt = user.createdAt
//     this.updatedAt = user.updatedAt
//     this.disabledAt = user.disabledAt
//     this.deletedAt = user.disabledAt
//     this.firstName = user.firstName
//     this.lastName = user.lastName
//     this.email = user.email
//     this.phone = user.phone
//     this.passwordHash = user.passwordHash
//     this.description = user.description
//     this.imageUri = user.imageUri
//     this.darkMode = user.darkMode
//     this.language = user.language
//   }

//   id: string
//   createdAt: Date
//   updatedAt: Date
//   disabledAt: Date | null
//   deletedAt: Date | null
//   firstName: string
//   lastName: string
//   email: string
//   phone: string
//   passwordHash: string
//   description: string | null
//   imageUri: string | null
//   darkMode: boolean
//   language: ELanguage

//   static handle(user: UserResponseEntity) {
//     return {
//       id: user.id,
//       disabledAt: user.disabledAt,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       phone: user.phone,
//       description: user.description,
//       imageUri: user.imageUri,
//       darkMode: user.darkMode,
//       language: user.language
//     }
//   }
// }
