import { PaginationDto } from './dto/pagination.dto'
import { PaginationResponse } from './entity/pagination-response.entity'
import { PaginationEntity } from './entity/pagination.entity'

export class PaginationUtil {
  static options(dto: PaginationDto): PaginationEntity {
    const { skip, take } = PaginationUtil.format(dto)

    return {
      skip: (skip - 1) * take,
      take,
      orderBy: { [dto.sort]: dto.orderBy }
    } as PaginationEntity
  }

  static result<Entity>(
    entities: Entity[],
    options: PaginationDto,
    total: number
  ): PaginationResponse<Entity> {
    const { skip, take } = PaginationUtil.format(options)

    const has_more = skip * take < total
    const next_page = skip + 1 > Math.ceil(total / take) ? null : skip + 1
    const prev_page = skip - 1 < 1 ? null : skip - 1
    const last_page = Math.ceil(total / take)

    return {
      skip,
      size: take,
      total,
      sort: options.sort,
      order: options.orderBy,
      has_more,
      prev_page: last_page > prev_page ? prev_page : last_page,
      next_page,
      last_page,
      data: entities
    }
  }

  private static format({ skip, take }: PaginationDto) {
    return {
      skip: skip ? Math.abs(Math.floor(skip)) : 1,
      take: take ? Math.abs(Math.floor(take)) : 20
    }
  }
}
