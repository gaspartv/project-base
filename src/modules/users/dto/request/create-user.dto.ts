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

export class UserCreateDto {
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

  @IsString()
  login: string

  @IsPhoneNumber('BR')
  phone: string

  @IsString()
  cpf: string

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string

  @IsBoolean()
  darkMode?: boolean

  @IsEnum(ELanguage)
  language?: ELanguage
}
