import { IsEnum, IsOptional } from 'class-validator'
import { BooleanQuery } from '../../../../common/enum/boolean-query.enum'
import { PaginationDto } from '../../../../common/pagination/pagination.dto'

export class UserPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(BooleanQuery)
  disabled?: BooleanQuery

  @IsOptional()
  @IsEnum(BooleanQuery)
  deletedAt?: BooleanQuery
}
