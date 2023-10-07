import { Expose } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'

enum PaginationSort {
  ASC = 'asc',
  DESC = 'desc'
}

export class PaginationDto {
  @Expose()
  @IsOptional()
  @IsString()
  skip: number

  @Expose()
  @IsOptional()
  @IsString()
  take: number

  @Expose()
  @IsOptional()
  @IsEnum(PaginationSort)
  sort: PaginationSort

  @Expose()
  @IsOptional()
  orderBy: any

  @Expose()
  @IsOptional()
  where: any
}
