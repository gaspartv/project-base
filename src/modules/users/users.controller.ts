import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Sign } from '../../common/decorators/auth-sign.decorator'
import { IsPublic } from '../../common/decorators/is-public.decorator'
import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe'
import { ISign } from '../auth/interfaces/payload.interface'
import { UserCreateDto } from './dto/create-user.dto'
import { MessageCreateFileDto } from './dto/update-photo-user.entity'
import { UserUpdateDto } from './dto/update-user.dto'
import { UserResponseEntity } from './entities/user.entity'
import { UsersService } from './users.service'

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @IsPublic()
  @Post()
  async create(@Body() dto: UserCreateDto): Promise<UserResponseEntity> {
    return await this.service.create(dto)
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUuidPipe) id: string
  ): Promise<UserResponseEntity> {
    return await this.service.userOrThrow(id)
  }

  @Get('/profile')
  async findProfile(@Sign() sign: ISign): Promise<UserResponseEntity> {
    return await this.service.userOrThrow(sign.sub)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UserUpdateDto
  ): Promise<UserResponseEntity> {
    return await this.service.update(id, dto)
  }

  @Patch(':id/photo')
  async updatePhoto(
    @Body() dto: MessageCreateFileDto,
    @Param('id', ParseUuidPipe) id: string
  ): Promise<UserResponseEntity> {
    return await this.service.updatePhoto(id, dto.file)
  }
}
