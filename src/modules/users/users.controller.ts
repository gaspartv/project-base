import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Sign } from '../../common/decorators/auth-sign.decorator'
import { IsPublic } from '../../common/decorators/is-public.decorator'
import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe'
import { ISign } from '../auth/interfaces/payload.interface'
import { UserCreateDto } from './dto/request/create-user.dto'
import { UserPaginationDto } from './dto/request/pagination-user.dto'
import { MessageCreateFileDto } from './dto/request/update-photo-user.dto'
import { UserPaginationResponseDto } from './dto/response/response-pagination-user.dto'
import { UserResponseDto } from './dto/response/response-user.dto'
import { UserUpdateDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @IsPublic()
  @Post()
  create(@Body() dto: UserCreateDto): Promise<UserResponseDto> {
    return this.service.create(dto)
  }

  @Get(':id')
  findOne(@Param('id', ParseUuidPipe) id: string): Promise<UserResponseDto> {
    return this.service.findOne(id)
  }

  @Get('/profile')
  findProfile(@Sign() sign: ISign): Promise<UserResponseDto> {
    return this.service.findOne(sign.sub)
  }

  @Get()
  findMany(
    @Query() pagination: UserPaginationDto
  ): Promise<UserPaginationResponseDto> {
    return this.service.findMany(pagination)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UserUpdateDto
  ): Promise<UserResponseDto> {
    return this.service.update(id, dto)
  }

  @Patch(':id/photo')
  updatePhoto(
    @Body() dto: MessageCreateFileDto,
    @Param('id', ParseUuidPipe) id: string
  ): Promise<UserResponseDto> {
    return this.service.updatePhoto(id, dto.file)
  }
}
