import { Expose } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export enum PaginationOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export class PaginationDto {
  @Expose()
  @IsOptional()
  @IsString()
  page: number

  @Expose()
  @IsOptional()
  @IsString()
  size: number

  @Expose()
  @IsOptional()
  @IsString()
  sort: string

  @Expose()
  @IsOptional()
  @IsEnum(PaginationOrder)
  order: PaginationOrder
}
