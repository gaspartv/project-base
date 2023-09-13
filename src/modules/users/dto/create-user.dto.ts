import { ELanguage } from '@prisma/client'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string

  @IsEmail()
  email: string

  @IsPhoneNumber('BR')
  phone: string

  @IsString()
  @MinLength(5)
  password: string

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string

  @IsString()
  @IsOptional()
  imageUri?: string

  @IsBoolean()
  darkMode: boolean

  @IsEnum(ELanguage)
  language: ELanguage
}
