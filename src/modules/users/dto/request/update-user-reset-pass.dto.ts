import { Expose } from 'class-transformer'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class UserUpdatePassResetDto {
  @Expose()
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  newPassword: string

  @Expose()
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  confirmNewPassword: string
}
