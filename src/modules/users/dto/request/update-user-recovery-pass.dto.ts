import { Expose } from 'class-transformer'
import { IsEmail } from 'class-validator'

export class UserUpdatePassRecoveryDto {
  @Expose()
  @IsEmail()
  email: string
}
