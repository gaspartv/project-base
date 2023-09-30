import { Type } from 'class-transformer'
import { PaginationResponse } from '../../../../common/pagination/pagination-response.entity'
import { UserResponseDto } from './response-user.dto'

export class UserPaginationResponseDto extends PaginationResponse<UserResponseDto> {
  @Type(() => UserResponseDto)
  data: UserResponseDto[]
}
