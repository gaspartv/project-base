import { Expose } from 'class-transformer'
import { UserWhereDto } from '../../modules/users/dto/where-user.dto'

export class PaginationEntity {
  @Expose() skip?: number
  @Expose() take?: number
  @Expose() size?: never
  @Expose() orderBy?: any
  @Expose() sort?: never
  @Expose() where?: any
}
