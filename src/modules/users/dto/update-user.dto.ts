import { PartialType } from '@nestjs/swagger'
import { UserCreateDto } from './request/create-user.dto'

export class UserUpdateDto extends PartialType(UserCreateDto) {}
