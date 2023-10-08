import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception'
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'
import { randomUUID } from 'crypto'
import { GeneratorFile } from '../../common/utils/generator-file'
import { HashProvider } from '../../providers/hashing/hash.provider'
import { ResponsePassTokenEntity } from '../pass-tokens/entity/pass-token.entity'
import { PassTokensService } from '../pass-tokens/pass-tokens.service'
import { UserCreateDto } from './dto/request/create-user.dto'
import { UserPaginationDto } from './dto/request/pagination-user.dto'
import { UserUpdateEmailDto } from './dto/request/update-user-email.dto'
import { MessageFileDto } from './dto/request/update-user-photo.dto'
import { UserUpdatePoliceDto } from './dto/request/update-user-police.dto'
import { UserUpdatePassResetDto } from './dto/request/update-user-reset-pass.dto'
import { UserUpdateSettingsDto } from './dto/request/update-user-settings.dto'
import { UserUpdateDto } from './dto/request/update-user.dto'
import { UserVerifyUniqueFieldDto } from './dto/verify-unique-field.dto'
import { UserWhereDto } from './dto/where-user.dto'
import { UserEntity, UserResponseEntity } from './entities/user.entity'
import { UsersRepository } from './repositories/users.repository'

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly passTokensService: PassTokensService
  ) {}

  async create(dto: UserCreateDto): Promise<UserResponseEntity> {
    const { email, phone } = dto

    await this.verifyUniqueFieldToCreated(email, phone)

    const password: string = randomUUID().toString()

    const entity: UserEntity = new UserEntity({
      ...dto,
      password
    })

    return await this.repository.create(entity)
  }

  async findOneForAuth(login: string): Promise<UserResponseEntity> {
    const user = await this.repository.findOneByLogin(login)

    if (!user) {
      throw new NotFoundException('user not found')
    }

    return user
  }

  async findMany(options: UserPaginationDto): Promise<UserResponseEntity[]> {
    return await this.repository.findMany(options)
  }

  async count(options: UserPaginationDto): Promise<number> {
    return await this.repository.count(options)
  }

  async enable(id: string): Promise<UserResponseEntity> {
    const userFound: UserResponseEntity = await this.findOneWhere({ id })

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
      disabledAt: new Date(),
      deletedAt: new Date()
    })

    return await this.repository.update(entity)
  }

  async update(id: string, dto: UserUpdateDto): Promise<UserResponseEntity> {
    const userFound: UserResponseEntity = await this.userOrThrow(id)

    await this.verifyUniqueFieldToUpdate(id, userFound.email, dto.phone)

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

    const imageUri: string = await GeneratorFile.uri(file)

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

  async updateEmail(
    dto: UserUpdateEmailDto,
    id: string
  ): Promise<UserResponseEntity> {
    const userFound: UserResponseEntity = await this.userOrThrow(id)

    await this.verifyUniqueFieldToUpdate(id, dto.email, userFound.phone)

    const entity: UserEntity = new UserEntity({
      ...userFound,
      ...dto,
      updatedAt: new Date()
    })

    return await this.repository.update(entity)
  }

  async updateSettings(
    dto: UserUpdateSettingsDto,
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

  async resetPass(
    passTokenId: string,
    dto: UserUpdatePassResetDto
  ): Promise<ResponsePassTokenEntity> {
    const { confirmNewPassword, newPassword } = dto

    if (newPassword !== confirmNewPassword) {
      throw new ConflictException('New Passwords do not match')
    }

    const token: ResponsePassTokenEntity =
      await this.passTokensService.passTokenValidate(passTokenId)

    const userId: string = token.userId

    const userFound: UserResponseEntity = await this.userOrThrow(userId)

    HashProvider.passwordIsMatch(newPassword, userFound.passwordHash)

    const passwordHash: string = HashProvider.passwordHash(newPassword)

    const entity = new UserEntity({
      ...userFound,
      passwordHash: passwordHash
    })

    await this.repository.update(entity)

    return await this.passTokensService.revoke(token.id)
  }

  async recoveryPass(email: string) {
    const user = await this.findOneWhere({ email })

    const passToken = await this.passTokensService.create(user.id)

    await this.passTokensService.recoveryPass(email, passToken.id)

    return
  }

  /// EXTRA ///

  async findOneWhere(where: UserWhereDto): Promise<UserResponseEntity> {
    const user = await this.repository.findOneWhere(where)

    if (!user) {
      throw new NotFoundException('user not found')
    }

    return new UserResponseEntity(user)
  }

  async userOrThrow(id: string): Promise<UserResponseEntity> {
    const user = await this.repository.findOne(id)

    if (!user) {
      throw new NotFoundException('user not found')
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
