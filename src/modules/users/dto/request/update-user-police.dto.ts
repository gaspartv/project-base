import { EUserPolice } from '@prisma/client'
import { IsEnum } from 'class-validator'

export class UserUpdatePoliceDto {
  @IsEnum(EUserPolice)
  police: EUserPolice
}
