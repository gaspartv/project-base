import { TokenResponseDto } from '../dto/auth-response.dto'

export function AuthLoginResponseMapper(token: string): TokenResponseDto {
  return { token }
}
