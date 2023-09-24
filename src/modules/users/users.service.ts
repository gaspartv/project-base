import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { UserNotFoundError } from '../../common/errors/not-found/UserNotFound.error'
import { uriGenerator } from '../../common/utils/uri-generator.util'
import { CreateUserDto } from './dto/create-user.dto'
import { MessageFileDto } from './dto/update-photo-user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { VerifyUniqueFieldUserDto } from './dto/verify-unique-field.dto'
import { UserEntity, UserResponseEntity } from './entities/user.entity'
import { UsersRepository } from './repositories/users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<UserResponseEntity> {
    await this.verifyUniqueFieldToCreated(dto.email, dto.phone)

    const passwordHash: string = await hash(
      dto.password,
      Number(process.env.HASH_SALT)
    )

    const entity: UserEntity = new UserEntity({
      ...dto,
      passwordHash: passwordHash
    })

    const userCreate: UserResponseEntity = await this.repository.create(entity)

    return new UserResponseEntity(userCreate)
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseEntity> {
    await this.verifyUniqueFieldToUpdate(id, dto.email, dto.phone)

    const userFound: UserEntity = await this.userOrThrow(id)

    const entity: UserEntity = new UserEntity({
      ...userFound,
      ...dto
    })

    const userCreate: UserResponseEntity = await this.repository.update(entity)

    return new UserResponseEntity(userCreate)
  }

  async updatePhoto(
    id: string,
    file: MessageFileDto
  ): Promise<UserResponseEntity> {
    const userFound: UserEntity = await this.userOrThrow(id)

    const imageUri: string = await uriGenerator(file)

    const entity: UserEntity = new UserEntity({
      ...userFound,
      imageUri
    })

    const userPhotoEdit: UserResponseEntity =
      await this.repository.update(entity)

    return new UserResponseEntity(userPhotoEdit)
  }

  /// EXTRA ///
  async userOrThrow(id: string): Promise<UserResponseEntity> {
    const user: UserResponseEntity = await this.repository.findOne(id)

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

    return
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

    return
  }
}
