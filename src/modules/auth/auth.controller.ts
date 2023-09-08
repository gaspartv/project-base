import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LocalAuth } from '../../common/decorators/auth-local.decorator'
import { Sign } from '../../common/decorators/auth-sign.decorator'
import { IsPublic } from '../../common/decorators/is-public.decorator'
import { AuthService } from './auth.service'
import { ResponseTokenDto } from './dto/auth-response.dto'
import { MessageDto } from './dto/message.dto'
import { ISign } from './interfaces/payload.interface'
import { IRequest } from './interfaces/request.interface'
import { AuthLoginResponseMapper } from './mappers/auth-login.response.mapper'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @IsPublic()
  @LocalAuth()
  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: IRequest): Promise<ResponseTokenDto> {
    const { token } = await this.service.login(req.user)

    return AuthLoginResponseMapper(token)
  }

  @Delete()
  async logout(@Sign() sign: ISign): Promise<MessageDto> {
    await this.service.logout(sign.sub)

    return { message: 'logout successfully' }
  }
}
