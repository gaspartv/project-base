import { EUserPolice } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'
import { BooleanQuery } from '../../../../common/enum/boolean-query.enum'
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto'

export class UserPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(BooleanQuery)
  disabled?: BooleanQuery

  @IsOptional()
  @IsEnum(BooleanQuery)
  deletedAt?: BooleanQuery

  @IsOptional()
  @IsEnum(EUserPolice)
  police?: EUserPolice
}
