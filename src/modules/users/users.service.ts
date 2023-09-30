import { ConflictException, Injectable, Logger } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { UserNotFoundError } from '../../common/errors/not-found/UserNotFound.error'
import { PaginationUtil } from '../../common/pagination/pagination.util'
import { uriGenerator } from '../../common/utils/uri-generator.util'
import { UserCreateDto } from './dto/request/create-user.dto'
import { UserPaginationDto } from './dto/request/pagination-user.dto'
import { MessageFileDto } from './dto/request/update-photo-user.dto'
import { UserPaginationResponseDto } from './dto/response/response-pagination-user.dto'
import { UserResponseDto } from './dto/response/response-user.dto'
import { UserUpdateDto } from './dto/update-user.dto'
import { UserVerifyUniqueFieldDto } from './dto/verify-unique-field.dto'
import { UserEntity, UserResponseEntity } from './entities/user.entity'
import { UsersRepository } from './repositories/users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(dto: UserCreateDto): Promise<UserResponseDto> {
    await this.verifyUniqueFieldToCreated(dto.email, dto.phone)

    const password = randomUUID().toString()

    const passwordHash: string = await hash(
      password,
      Number(process.env.HASH_SALT)
    )

    const entity: UserEntity = new UserEntity({
      ...dto,
      passwordHash: passwordHash
    })

    const userCreate = await this.repository.create(entity)

    if (process.env.NODE_ENV === 'dev') {
      Logger.log({ message: password })
    }

    return UserResponseDto.handle(userCreate)
  }

  async update(id: string, dto: UserUpdateDto): Promise<UserResponseDto> {
    await this.verifyUniqueFieldToUpdate(id, dto.email, dto.phone)

    const userFound: UserEntity = await this.userOrThrow(id)

    const entity: UserEntity = new UserEntity({
      ...userFound,
      ...dto,
      updatedAt: new Date()
    })

    const userUpdate = await this.repository.update(entity)

    return UserResponseDto.handle(userUpdate)
  }

  async updatePhoto(
    id: string,
    file: MessageFileDto
  ): Promise<UserResponseDto> {
    const userFound: UserEntity = await this.userOrThrow(id)

    const imageUri: string = await uriGenerator(file)

    const entity: UserEntity = new UserEntity({
      ...userFound,
      imageUri: imageUri,
      updatedAt: new Date()
    })

    const userUpdate = await this.repository.update(entity)

    return UserResponseDto.handle(userUpdate)
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const userFind = await this.userOrThrow(id)

    return UserResponseDto.handle(userFind)
  }

  async findMany(
    options: UserPaginationDto
  ): Promise<UserPaginationResponseDto> {
    const users = await this.repository.findMany(options)
    const count = await this.repository.count(options)

    const result = PaginationUtil.result(
      users.map((e) => UserResponseDto.handle(e)),
      options,
      count
    )

    return result
  }

  /// EXTRA ///
  async userOrThrow(id: string): Promise<UserResponseEntity> {
    const user = await this.repository.findOne(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
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
}
