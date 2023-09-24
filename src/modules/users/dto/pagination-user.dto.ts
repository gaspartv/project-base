import { Expose } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'
import { BooleanQuery } from '../../../common/enum/boolean-query.enum'
import { PaginationDto } from '../../../common/pagination/pagination.dto'

export class UserPaginationDto extends PaginationDto {
  @Expose()
  @IsOptional()
  @IsEnum(BooleanQuery)
  disabled?: BooleanQuery

  @Expose()
  @IsOptional()
  @IsEnum(BooleanQuery)
  deletedAt?: BooleanQuery
}
