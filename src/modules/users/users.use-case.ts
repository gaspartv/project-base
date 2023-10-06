import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { PaginationUtil } from '../../common/pagination/pagination.util'
import { MessageDto } from '../auth/dto/message.dto'
import { UserCreateDto } from './dto/request/create-user.dto'
import { UserPaginationDto } from './dto/request/pagination-user.dto'
import { UserUpdateEmailDto } from './dto/request/update-user-email.dto'
import { MessageFileDto } from './dto/request/update-user-photo.dto'
import { UserUpdatePoliceDto } from './dto/request/update-user-police.dto'
import { UserUpdatePassResetDto } from './dto/request/update-user-reset-pass.dto'
import { UserUpdateSettingsDto } from './dto/request/update-user-settings.dto'
import { UserUpdateDto } from './dto/request/update-user.dto'
import { UserPaginationResponseDto } from './dto/response/response-pagination-user.dto'
import { UserResponseDto } from './dto/response/response-user.dto'
import { UserResponseEntity } from './entities/user.entity'
import { UsersService } from './users.service'

@Injectable()
export class UsersUseCase {
  constructor(private readonly usersService: UsersService) {}

  async create(dto: UserCreateDto): Promise<UserResponseDto> {
    const userCreate: UserResponseEntity = await this.usersService.create(dto)

    return UserResponseDto.handle(userCreate)
  }

  async update(id: string, dto: UserUpdateDto): Promise<UserResponseDto> {
    const userUpdate = await this.usersService.update(id, dto)

    return UserResponseDto.handle(userUpdate)
  }

  async updatePhoto(
    id: string,
    file: MessageFileDto
  ): Promise<UserResponseDto> {
    const userUpdate = await this.usersService.updatePhoto(id, file)

    return UserResponseDto.handle(userUpdate)
  }

  async updatePolice(dto: UserUpdatePoliceDto, id: string) {
    const userUpdate = await this.usersService.updatePolice(dto, id)

    return UserResponseDto.handle(userUpdate)
  }

  async updateEmail(
    dto: UserUpdateEmailDto,
    id: string
  ): Promise<UserResponseDto> {
    const userUpdate = await this.usersService.updateEmail(dto, id)

    return UserResponseDto.handle(userUpdate)
  }

  async updateSettings(
    dto: UserUpdateSettingsDto,
    id: string
  ): Promise<UserResponseDto> {
    const userUpdate = await this.usersService.updateSettings(dto, id)

    return UserResponseDto.handle(userUpdate)
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const userFind: UserResponseEntity = await this.usersService.userOrThrow(id)

    return UserResponseDto.handle(userFind)
  }

  async findMany(
    options: UserPaginationDto
  ): Promise<UserPaginationResponseDto> {
    const users = await this.usersService.findMany(options)

    const count = await this.usersService.count(options)

    return PaginationUtil.result(
      users.map((user) => ({
        ...UserResponseDto.handle(user),
        settings: undefined,
        Session: undefined
      })),
      options,
      count
    )
  }

  async resetPass(
    passTokenId: string,
    dto: UserUpdatePassResetDto
  ): Promise<MessageDto> {
    await this.usersService.resetPass(passTokenId, dto)

    return { message: 'password updated successfully' }
  }

  async recoveryPass(email: string) {
    await this.usersService.recoveryPass(email)

    return { message: 'password recovery successfully' }
  }

  async enable(id: string): Promise<UserResponseDto> {
    const user = await this.usersService.enable(id)

    return UserResponseDto.handle(user)
  }

  async disable(id: string): Promise<UserResponseDto> {
    const user = await this.usersService.disable(id)

    return UserResponseDto.handle(user)
  }

  async delete(id: string): Promise<MessageDto> {
    await this.usersService.delete(id)

    return { message: 'user deleted successfully' }
  }
}
