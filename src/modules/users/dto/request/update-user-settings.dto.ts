import { ELanguage } from '@prisma/client'
import { IsBoolean, IsEnum } from 'class-validator'

export class UserUpdateSettingsDto {
  @IsBoolean()
  darkMode: boolean

  @IsEnum(ELanguage)
  language: ELanguage
}
