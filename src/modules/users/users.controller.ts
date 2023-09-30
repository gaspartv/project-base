import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Sign } from '../../common/decorators/auth-sign.decorator'
import { IsPublic } from '../../common/decorators/is-public.decorator'
import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe'
import { MessageDto } from '../auth/dto/message.dto'
import { ISign } from '../auth/interfaces/payload.interface'
import { UserCreateDto } from './dto/request/create-user.dto'
import { UserPaginationDto } from './dto/request/pagination-user.dto'
import { MessageCreateFileDto } from './dto/request/update-photo-user.dto'
import { UserUpdatePoliceDto } from './dto/request/update-police-user.dto'
import { UserPaginationResponseDto } from './dto/response/response-pagination-user.dto'
import { UserResponseDto } from './dto/response/response-user.dto'
import { UserUpdateDto } from './dto/update-user.dto'
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
}
