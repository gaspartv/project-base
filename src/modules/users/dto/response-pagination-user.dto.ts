import { Type } from 'class-transformer'
import { PaginationResponse } from '../../../common/pagination/pagination-response.entity'
import { UserResponseEntity } from '../entities/user.entity'

export class PaginationResponseUserDto extends PaginationResponse<UserResponseEntity> {
  @Type(() => UserResponseEntity)
  data: UserResponseEntity[]
}
