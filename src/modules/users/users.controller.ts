import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator'
import {
  Get,
  Patch,
  Post
} from '@nestjs/common/decorators/http/request-mapping.decorator'
import {
  Body,
  Param,
  Query
} from '@nestjs/common/decorators/http/route-params.decorator'
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe'
import { ApiTags } from '@nestjs/swagger'
import { IsPublic } from '../../common/decorators/custom/is-public.decorator'
import { Sign } from '../../common/decorators/param/sign.decorator'
import { MessageDto } from '../../common/dto/message.dto'
import { ISign } from '../../common/interfaces/jwt-payload.interface'
import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe'
import { UserCreateDto } from './dto/request/create-user.dto'
import { UserPaginationDto } from './dto/request/pagination-user.dto'
import { UserUpdateEmailDto } from './dto/request/update-user-email.dto'
import { MessageCreateFileDto } from './dto/request/update-user-photo.dto'
import { UserUpdatePoliceDto } from './dto/request/update-user-police.dto'
import { UserUpdatePassRecoveryDto } from './dto/request/update-user-recovery-pass.dto'
import { UserUpdatePassResetDto } from './dto/request/update-user-reset-pass.dto'
import { UserUpdateSettingsDto } from './dto/request/update-user-settings.dto'
import { UserUpdateDto } from './dto/request/update-user.dto'
import { UserPaginationResponseDto } from './dto/response/response-pagination-user.dto'
import { UserResponseDto } from './dto/response/response-user.dto'
import { UsersUseCase } from './users.use-case'

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly useCase: UsersUseCase) {}

  @IsPublic()
  @Post()
  @HttpCode(201)
  create(@Body() dto: UserCreateDto): Promise<UserResponseDto> {
    return this.useCase.create(dto)
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', ParseUuidPipe) id: string): Promise<UserResponseDto> {
    return this.useCase.findOne(id)
  }

  @Get('/profile')
  @HttpCode(200)
  findProfile(@Sign() sign: ISign): Promise<UserResponseDto> {
    return this.useCase.findOne(sign.sub)
  }

  @Get()
  @HttpCode(200)
  findMany(
    @Query() pagination: UserPaginationDto
  ): Promise<UserPaginationResponseDto> {
    return this.useCase.findMany(pagination)
  }

  @Patch(':id')
  @HttpCode(200)
  updateUser(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UserUpdateDto
  ): Promise<UserResponseDto> {
    return this.useCase.update(id, dto)
  }

  @Patch(':id/photo')
  @HttpCode(200)
  updatePhoto(
    @Body() dto: MessageCreateFileDto,
    @Param('id', ParseUuidPipe) id: string
  ): Promise<UserResponseDto> {
    return this.useCase.updatePhoto(id, dto.file)
  }

  @Patch(':id/police')
  @HttpCode(200)
  updatePolice(
    @Body() dto: UserUpdatePoliceDto,
    @Param('id', ParseUuidPipe) id: string
  ): Promise<UserResponseDto> {
    return this.useCase.updatePolice(dto, id)
  }

  @Patch(':id/email')
  @HttpCode(200)
  updateEmail(
    @Body() dto: UserUpdateEmailDto,
    @Param('id', ParseUuidPipe) id: string
  ): Promise<UserResponseDto> {
    return this.useCase.updateEmail(dto, id)
  }

  @Patch(':id/settings')
  @HttpCode(200)
  updateSettings(
    @Body() dto: UserUpdateSettingsDto,
    @Param('id', ParseUuidPipe) id: string
  ) {
    return this.useCase.updateSettings(dto, id)
  }

  @Patch(':id/disable')
  @HttpCode(200)
  disable(@Param('id', ParseUuidPipe) id: string): Promise<UserResponseDto> {
    return this.useCase.disable(id)
  }

  @Patch(':id/enable')
  @HttpCode(200)
  enable(@Param('id', ParseUuidPipe) id: string): Promise<UserResponseDto> {
    return this.useCase.enable(id)
  }

  @Patch(':id/delete')
  @HttpCode(204)
  delete(@Param('id', ParseUuidPipe) id: string): Promise<MessageDto> {
    return this.useCase.delete(id)
  }

  @IsPublic()
  @Patch('password/reset/:passTokenId')
  @HttpCode(200)
  resetPass(
    @Param('passTokenId', ParseUUIDPipe) passTokenId: string,
    @Body() dto: UserUpdatePassResetDto
  ): Promise<MessageDto> {
    return this.useCase.resetPass(passTokenId, dto)
  }

  @IsPublic()
  @Patch('password/recovery')
  @HttpCode(204)
  recoveryPass(@Body() { email }: UserUpdatePassRecoveryDto) {
    return this.useCase.recoveryPass(email)
  }
}
