import { UserEntity } from '../../users/entities/user.entity'
import { TokenResponseDto } from '../dto/auth-response.dto'

export function AuthLoginResponseMapper(
  token: string,
  User: UserEntity
): TokenResponseDto {
  return { token, User }
}
