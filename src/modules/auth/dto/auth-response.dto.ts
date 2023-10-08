import { UserResponseDto } from '../../users/dto/response/response-user.dto'
import { UserResponseEntity } from '../../users/entities/user.entity'

export class AuthResponseDto {
  constructor(response: AuthResponseDto) {
    this.token = response.token
    this.User = response.User
  }

  token: string
  User: UserResponseDto

  static handle({ token, user }: AuthResponse): AuthResponseDto {
    return {
      token: token,
      User: { ...UserResponseDto.handle(user) }
    }
  }
}

export class AuthResponse {
  token: string
  user: UserResponseEntity
}
