import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { UserNotFoundError } from '../../../../common/errors/not-found/UserNotFound.error'
import { UserVerifyUniqueFieldDto } from '../../dto/verify-unique-field.dto'
import { UserWhereDto } from '../../dto/where-user.dto'
import { UserEntity, UserResponseEntity } from '../../entities/user.entity'
import { UsersRepository } from '../users.repository'

@Injectable()
export class UsersFakeRepository implements UsersRepository {
  users: UserResponseEntity[] = []

  async create(entity: UserEntity): Promise<UserResponseEntity> {
    return new UserResponseEntity({
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
      language: 'PT_BR',
      lastName: null,
      passwordHash: '',
      phone: '',
      ...entity
    })
  }

  async update(entity: UserEntity): Promise<UserResponseEntity> {
    const userIndex = this.users.findIndex((el) => el.id === entity.id)

    const userEdit = {
      ...this.users[userIndex],
      ...entity
    }

    this.users[userIndex] = userEdit

    return new UserResponseEntity(userEdit)
  }

  async findOne(id: string): Promise<UserResponseEntity> {
    const user = this.users.find((el) => el.id === id)

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }

  async verifyUniqueFieldToCreated(
    dto: UserVerifyUniqueFieldDto
  ): Promise<UserVerifyUniqueFieldDto> {
    return this.users.find(
      (el) => el.email === dto.email || el.phone === dto.phone
    )
  }

  async verifyUniqueFieldToUpdate(
    id: string,
    dto: UserVerifyUniqueFieldDto
  ): Promise<UserVerifyUniqueFieldDto> {
    return this.users.find(
      (el) =>
        (el.id !== id && el.email === dto.email) ||
        (el.id !== id && el.phone === dto.phone)
    )
  }

  async findOneWhere(where: UserWhereDto): Promise<UserResponseEntity> {
    const user = this.users.find((user) => {
      return Object.entries(where).every(([key, value]) => {
        return user[key] === value
      })
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }
}
