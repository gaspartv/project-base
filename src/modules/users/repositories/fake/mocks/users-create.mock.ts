import { ELanguage } from '@prisma/client'
import { randomUUID } from 'crypto'
import { CreateUserDto } from '../../../dto/create-user.dto'

export const userCreateEntityMock = {
  id: randomUUID(),
  createdAt: new Date(),
  updatedAt: new Date(),
  disabledAt: null,
  deletedAt: null,
  imageUri: null,
  darkMode: false,
  description: '',
  email: null,
  firstName: null,
  language: ELanguage.PT_BR,
  lastName: null,
  passwordHash: '',
  phone: '',
  password: '123'
}

export const userCreateMock: CreateUserDto = {
  email: 'test@mail.com',
  firstName: 'test',
  lastName: 'test',
  language: ELanguage.PT_BR,
  darkMode: false,
  password: '123',
  phone: '5532998274714',
  description: 'Tibia-Info',
  imageUri: null
}

export const userCreateToUpdateMock: CreateUserDto = {
  email: 'test_update@mail.com',
  firstName: 'test_update',
  lastName: 'test_update',
  language: ELanguage.PT_BR,
  darkMode: false,
  password: '123',
  phone: '5532998274714',
  description: 'Tibia-Info',
  imageUri: null
}
