import { IsString } from 'class-validator'

export class RequestLoginDto {
  @IsString()
  login: string

  @IsString()
  password: string
}
