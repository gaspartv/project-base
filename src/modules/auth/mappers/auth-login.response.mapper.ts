import { ResponseTokenDto } from '../dto/auth-response.dto'

export function AuthLoginResponseMapper(token: string): ResponseTokenDto {
  return { token }
}
