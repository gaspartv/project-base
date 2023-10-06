import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Expose } from 'class-transformer'

export enum PaginationOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export class PaginationResponse<Entity> {
  @ApiProperty() @Expose() skip: number
  @ApiProperty() @Expose() size: number
  @ApiProperty() @Expose() total: number
  @ApiProperty() @Expose() has_more: boolean
  @ApiProperty() @Expose() next_page: number
  @ApiProperty() @Expose() prev_page: number
  @ApiProperty() @Expose() last_page: number
  @ApiProperty() @Expose() sort: string
  @ApiProperty() @Expose() order: PaginationOrder
  @Expose() data: Entity[]
}
