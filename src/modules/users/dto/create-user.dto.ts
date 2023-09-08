import { ELanguage } from '@prisma/client'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsString()
  email: string

  @IsString()
  phone: string

  @IsString()
  password: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  imageUri?: string

  @IsBoolean()
  darkMode: boolean

  @IsEnum(ELanguage)
  language: ELanguage
}
