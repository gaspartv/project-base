import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { VerifyUniqueFieldUserDto } from '../../dto/verify-unique-field.dto'
import { CreateUserEntity } from '../../entities/create-user.entity'
import { UpdatePhotoUserEntity } from '../../entities/update-photo-user.entity'
import { UpdateUserEntity } from '../../entities/update-user.entity'
import { UserEntity } from '../../entities/user.entity'
import { UsersRepository } from '../users.repository'

@Injectable()
export class UsersFakeRepository implements UsersRepository {
  users: UserEntity[] = []

  async create(entity: CreateUserEntity): Promise<UserEntity> {
    return new UserEntity({
      ...entity,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      disabledAt: null,
      deletedAt: null,
      imageUri: null
    })
  }

  async update(id: string, entity: UpdateUserEntity): Promise<UserEntity> {
    const user = this.users.find((el) => el.id === id)

    return new UserEntity({
      ...user,
      ...entity
    })
  }

  async updatePhoto(
    id: string,
    entity: UpdatePhotoUserEntity
  ): Promise<UserEntity> {
    const user = this.users.find((el) => el.id === id)

    return new UserEntity({
      ...user,
      ...entity
    })
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.users.find((el) => el.id === id)
  }

  async verifyUniqueFieldToCreated(
    dto: VerifyUniqueFieldUserDto
  ): Promise<VerifyUniqueFieldUserDto> {
    return this.users.find(
      (el) => el.email === dto.email || el.phone === dto.phone
    )
  }

  async verifyUniqueFieldToUpdate(
    id: string,
    dto: VerifyUniqueFieldUserDto
  ): Promise<VerifyUniqueFieldUserDto> {
    return this.users.find(
      (el) =>
        (el.id !== id && el.email === dto.email) ||
        (el.id !== id && el.phone === dto.phone)
    )
  }
}
