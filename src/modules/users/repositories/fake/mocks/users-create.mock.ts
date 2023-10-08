import { ELanguage } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UserCreateDto } from '../../../dto/request/create-user.dto'

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

export const userCreateMock: UserCreateDto = {
  email: 'test@mail.com',
  firstName: 'test',
  lastName: 'test',
  language: ELanguage.PT_BR,
  darkMode: false,
  phone: '5532998274714',
  login: 'gaspar_text',
  cpf: '12345678901',
  description: 'Tibia-Info'
}

export const userCreateToUpdateMock: UserCreateDto = {
  email: 'test_update@mail.com',
  firstName: 'test_update',
  lastName: 'test_update',
  language: ELanguage.PT_BR,
  darkMode: false,
  phone: '5532998274714',
  login: 'gaspar_text',
  cpf: '12345678901',
  description: 'Tibia-Info'
}
