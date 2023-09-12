import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { UserNotFoundError } from '../../common/errors/not-found/UserNotFound.error'
import { uriGenerator } from '../../common/utils/uri-generator.util'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { VerifyUniqueFieldUserDto } from './dto/verify-unique-field.dto'
import { CreateUserEntity } from './entities/create-user.entity'
import { ResponseUserEntity } from './entities/response-user.entity'
import {
  MessageFileDto,
  UpdatePhotoUserEntity
} from './entities/update-photo-user.entity'
import { UpdateUserEntity } from './entities/update-user.entity'
import { UserEntity } from './entities/user.entity'
import { UsersRepository } from './repositories/users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<ResponseUserEntity> {
    await this.verifyUniqueFieldToCreated(dto.email, dto.phone)

    const passwordHash: string = await hash(
      dto.password,
      Number(process.env.HASH_SALT)
    )

    const entity: CreateUserEntity = new CreateUserEntity({
      ...dto,
      passwordHash
    })

    const userCreate: UserEntity = await this.repository.create(entity)

    return new ResponseUserEntity(userCreate)
  }

  async update(id: string, dto: UpdateUserDto): Promise<ResponseUserEntity> {
    await this.verifyUniqueFieldToUpdate(id, dto.email, dto.phone)

    const userFound: UserEntity = await this.userOrThrow(id)

    const entity: UpdateUserEntity = new UpdateUserEntity({
      ...userFound,
      ...dto
    })

    const userCreate: UserEntity = await this.repository.update(id, entity)

    return new ResponseUserEntity(userCreate)
  }

  async updatePhoto(
    id: string,
    file: MessageFileDto
  ): Promise<ResponseUserEntity> {
    await this.userOrThrow(id)

    const imageUri: string = await uriGenerator(file)

    const entity: UpdatePhotoUserEntity = new UpdatePhotoUserEntity({
      imageUri
    })

    const userPhotoEdit: UserEntity = await this.repository.updatePhoto(
      id,
      entity
    )

    return new ResponseUserEntity(userPhotoEdit)
  }

  /// EXTRA ///
  async userOrThrow(id: string): Promise<UserEntity> {
    const user: UserEntity = await this.repository.findOne(id)
    if (!user) throw new UserNotFoundError()
    return user
  }

  private async verifyUniqueFieldToUpdate(
    id: string,
    email: string,
    phone: string
  ): Promise<void> {
    const exceptions: string[] = []

    const uniqueFields: VerifyUniqueFieldUserDto = {
      email: email || undefined,
      phone: phone || undefined
    }

    const verifyUniqueKey: VerifyUniqueFieldUserDto =
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
  }

  private async verifyUniqueFieldToCreated(
    email: string,
    phone: string
  ): Promise<void> {
    const exceptions: string[] = []

    const uniqueFields: VerifyUniqueFieldUserDto = {
      email: email,
      phone: phone
    }

    const verifyUniqueKey: VerifyUniqueFieldUserDto =
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
  }
}
