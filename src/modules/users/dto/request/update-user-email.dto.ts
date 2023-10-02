import { IsString } from 'class-validator'

export class UserUpdateEmailDto {
  @IsString()
  email: string
}
