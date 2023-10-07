import { UserEntity } from '../../users/entities/user.entity'

export class TokenResponseDto {
  token: string
  User: UserEntity
}
