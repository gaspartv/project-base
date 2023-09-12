import { Body, Controller, Param, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IsPublic } from '../../common/decorators/is-public.decorator'
import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ResponseUserEntity } from './entities/response-user.entity'
import { CreateMessageFileDto } from './entities/update-photo-user.entity'
import { UsersService } from './users.service'

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @IsPublic()
  @Post()
  create(@Body() dto: CreateUserDto): Promise<ResponseUserEntity> {
    return this.service.create(dto)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUuidPipe)
    id: string,
    @Body() dto: UpdateUserDto
  ): Promise<ResponseUserEntity> {
    return this.service.update(id, dto)
  }

  @Patch(':id/photo')
  updatePhoto(
    @Body() body: CreateMessageFileDto,
    @Param('id', ParseUuidPipe) id: string
  ): Promise<ResponseUserEntity> {
    return this.service.updatePhoto(id, body.file)
  }
}
