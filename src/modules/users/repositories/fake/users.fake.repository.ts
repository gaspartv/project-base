import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { UserNotFoundError } from '../../../../common/errors/not-found/UserNotFound.error'
import { UserPaginationDto } from '../../dto/pagination-user.dto'
import { UserVerifyUniqueFieldDto } from '../../dto/verify-unique-field.dto'
import { UserWhereDto } from '../../dto/where-user.dto'
import { UserEntity } from '../../entities/user.entity'
import { UsersRepository } from '../users.repository'

@Injectable()
export class UsersFakeRepository implements UsersRepository {
  users: UserEntity[] = []

  async create(entity: UserEntity): Promise<UserEntity> {
    return new UserEntity({
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

  async update(entity: UserEntity): Promise<UserEntity> {
    const userIndex = this.users.findIndex((el) => el.id === entity.id)

    const userEdit = {
      ...this.users[userIndex],
      ...entity
    }

    this.users[userIndex] = userEdit

    return new UserEntity(userEdit)
  }

  async findOne(id: string): Promise<UserEntity> {
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

  async findOneWhere(where: UserWhereDto): Promise<UserEntity> {
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

  async findMany(options: UserPaginationDto): Promise<UserEntity[]> {
    const { orderBy, skip, sort, take, where } = options

    const {
      darkMode,
      deletedAt,
      disabledAt,
      email,
      firstName,
      imageUri,
      language,
      lastName,
      phone
    } = where

    const usersFilter = this.users.filter((user) =>
      user.darkMode === darkMode
        ? darkMode
        : undefined && user.deletedAt === deletedAt
        ? deletedAt
        : undefined && user.disabledAt === disabledAt
        ? disabledAt
        : undefined && user.email === email
        ? email
        : undefined && user.firstName === firstName
        ? firstName
        : undefined && user.imageUri === imageUri
        ? imageUri
        : undefined && user.language === language
        ? language
        : undefined && user.lastName === lastName
        ? lastName
        : undefined && user.phone === phone
        ? phone
        : undefined
    )

    const usersOrderBy = usersFilter.sort((a, b) =>
      orderBy === email
        ? sort === 'asc'
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email)
        : orderBy === firstName
        ? sort === 'asc'
          ? a.firstName.localeCompare(b.firstName)
          : b.firstName.localeCompare(a.firstName)
        : orderBy === lastName
        ? sort === 'asc'
          ? a.firstName.localeCompare(b.firstName)
          : b.firstName.localeCompare(a.firstName)
        : a.firstName.localeCompare(b.firstName)
    )

    const usersSlice = usersOrderBy.slice(skip, skip + take)

    return usersSlice
  }

  async count(options: UserPaginationDto): Promise<number> {
    const { where } = options

    const {
      darkMode,
      deletedAt,
      disabledAt,
      email,
      firstName,
      imageUri,
      language,
      lastName,
      phone
    } = where

    const usersFilter = this.users.filter((user) =>
      user.darkMode === darkMode
        ? darkMode
        : undefined && user.deletedAt === deletedAt
        ? deletedAt
        : undefined && user.disabledAt === disabledAt
        ? disabledAt
        : undefined && user.email === email
        ? email
        : undefined && user.firstName === firstName
        ? firstName
        : undefined && user.imageUri === imageUri
        ? imageUri
        : undefined && user.language === language
        ? language
        : undefined && user.lastName === lastName
        ? lastName
        : undefined && user.phone === phone
        ? phone
        : undefined
    )

    return usersFilter.length
  }
}
