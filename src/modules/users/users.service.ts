import { ConflictException, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { UserNotFoundError } from '../../common/errors/not-found/UserNotFound.error'
import { uriGenerator } from '../../common/utils/uri-generator.util'
import { CryptService } from '../../recipes/crypt/crypt.service'
import { UserCreateDto } from './dto/request/create-user.dto'
import { UserPaginationDto } from './dto/request/pagination-user.dto'
import { MessageFileDto } from './dto/request/update-photo-user.dto'
import { UserUpdatePoliceDto } from './dto/request/update-police-user.dto'
import { UserUpdateDto } from './dto/update-user.dto'
import { UserVerifyUniqueFieldDto } from './dto/verify-unique-field.dto'
import { UserWhereDto } from './dto/where-user.dto'
import { UserEntity, UserResponseEntity } from './entities/user.entity'
import { UsersRepository } from './repositories/users.repository'

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly cryptService: CryptService
  ) {}

  async create(dto: UserCreateDto): Promise<UserResponseEntity> {
    const { email, phone } = dto

    await this.verifyUniqueFieldToCreated(email, phone)

    const password: string = randomUUID().toString()

    const passwordHash = await this.cryptService.hashBcrypt(password)

    const entity: UserEntity = new UserEntity({
      ...dto,
      passwordHash
    })

    return await this.repository.create(entity)
  }

  async findOneWhere(where: UserWhereDto): Promise<UserResponseEntity> {
    const user = await this.repository.findOneWhere(where)

    if (!user) {
      throw new UserNotFoundError()
    }

    return new UserResponseEntity(user)
  }

  async findMany(options: UserPaginationDto): Promise<UserResponseEntity[]> {
    return await this.repository.findMany(options)
  }

  async count(options: UserPaginationDto): Promise<number> {
    return await this.repository.count(options)
  }

  async enable(id: string): Promise<UserResponseEntity> {
    const userFound: UserResponseEntity = await this.userOrThrow(id)

    const entity = new UserEntity({
      ...userFound,
      disabledAt: null
    })

    return await this.repository.update(entity)
  }

  async disable(id: string): Promise<UserResponseEntity> {
    const userFound: UserResponseEntity = await this.userOrThrow(id)

    const entity = new UserEntity({
      ...userFound,
      disabledAt: new Date()
    })

    return await this.repository.update(entity)
  }

  async delete(id: string): Promise<UserResponseEntity> {
    const userFound: UserResponseEntity = await this.userOrThrow(id)

    const entity = new UserEntity({
      ...userFound,
      deletedAt: new Date()
    })

    return await this.repository.update(entity)
  }

  async update(id: string, dto: UserUpdateDto): Promise<UserResponseEntity> {
    await this.verifyUniqueFieldToUpdate(id, dto.email, dto.phone)

    const userFound: UserResponseEntity = await this.userOrThrow(id)

    const entity: UserEntity = new UserEntity({
      ...userFound,
      ...dto,
      updatedAt: new Date()
    })

    return await this.repository.update(entity)
  }

  async updatePhoto(
    id: string,
    file: MessageFileDto
  ): Promise<UserResponseEntity> {
    const userFound: UserResponseEntity = await this.userOrThrow(id)

    const imageUri: string = await uriGenerator(file)

    const entity: UserEntity = new UserEntity({
      ...userFound,
      imageUri: imageUri,
      updatedAt: new Date()
    })

    return await this.repository.update(entity)
  }

  async updatePolice(
    dto: UserUpdatePoliceDto,
    id: string
  ): Promise<UserResponseEntity> {
    const userFound: UserResponseEntity = await this.userOrThrow(id)

    const entity: UserEntity = new UserEntity({
      ...userFound,
      ...dto,
      updatedAt: new Date()
    })

    return await this.repository.update(entity)
  }

  /// EXTRA ///

  async userOrThrow(id: string): Promise<UserResponseEntity> {
    const user = await this.repository.findOne(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }

  private async verifyUniqueFieldToCreated(
    email: string,
    phone: string
  ): Promise<void> {
    const exceptions: string[] = []

    const uniqueFields: UserVerifyUniqueFieldDto = {
      email: email,
      phone: phone
    }

    const verifyUniqueKey: UserVerifyUniqueFieldDto =
      await this.repository.verifyUniqueFieldToCreated(uniqueFields)

    if (verifyUniqueKey) {
      if (verifyUniqueKey.email === email) {
        exceptions.push('email already exists')
      }

      if (verifyUniqueKey.phone === phone) {
        exceptions.push('phone already exists')
      }
    }

    if (exceptions.length > 0) {
      throw new ConflictException(exceptions)
    }

    return
  }

  private async verifyUniqueFieldToUpdate(
    id: string,
    email: string,
    phone: string
  ): Promise<void> {
    const exceptions: string[] = []

    const uniqueFields: UserVerifyUniqueFieldDto = {
      email: email || undefined,
      phone: phone || undefined
    }

    const verifyUniqueKey: UserVerifyUniqueFieldDto =
      await this.repository.verifyUniqueFieldToUpdate(id, uniqueFields)

    if (verifyUniqueKey) {
      if (verifyUniqueKey.email === email) {
        exceptions.push('email already exists')
      }

      if (verifyUniqueKey.phone === phone) {
        exceptions.push('phone already exists')
      }
    }

    if (exceptions.length > 0) {
      throw new ConflictException(exceptions)
    }

    return
  }
}
