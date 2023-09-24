import { IsString } from 'class-validator'

export class SessionCreateDto {
  @IsString()
  userId: string
}
