import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

export class UserUpdateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string

  @IsPhoneNumber('BR')
  phone: string

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string
}
