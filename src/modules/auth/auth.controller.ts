import { Body, Controller, Delete, HttpCode, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IsPublic } from '../../common/decorators/custom/is-public.decorator'
import { LocalAuth } from '../../common/decorators/local-auth.decorator'
import { Sign } from '../../common/decorators/param/sign.decorator'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/auth-login.dto'
import { AuthResponseDto } from './dto/auth-response.dto'
import { MessageDto } from './dto/message.dto'
import { ISign } from './interfaces/payload.interface'
import { IRequest } from './interfaces/request.interface'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @IsPublic()
  @LocalAuth()
  @Post()
  @HttpCode(200)
  async login(
    @Req() req: IRequest,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _body: LoginDto
  ): Promise<AuthResponseDto> {
    const user = req.user

    return await this.service.login(user)
  }

  @Delete()
  async logout(@Sign() sign: ISign): Promise<MessageDto> {
    const userId: string = sign.sub

    return await this.service.logout(userId)
  }
}
