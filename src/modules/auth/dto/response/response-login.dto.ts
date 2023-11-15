import { UserResponseDto } from '../../../users/dto/response/response-user.dto';
import { UserResponseEntity } from '../../../users/user.entity';

export class ResponseLoginDto {
  constructor({ User, token }: ResponseLoginDto) {
    this.token = token;
    this.User = User;
  }

  readonly token: string;
  readonly User: UserResponseDto;

  static handle({ token, user }: AuthResponse): ResponseLoginDto {
    return {
      token: token,
      User: UserResponseDto.handle(user)
    };
  }
}

class AuthResponse {
  token: string;
  user: UserResponseEntity;
}
