import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator'
import {
  Delete,
  Post
} from '@nestjs/common/decorators/http/request-mapping.decorator'
import { Req } from '@nestjs/common/decorators/http/route-params.decorator'
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator'
import { IsPublic } from '../../common/decorators/custom/is-public.decorator'
import { LocalAuth } from '../../common/decorators/local-auth.decorator'
import { Sign } from '../../common/decorators/param/sign.decorator'
import { AuthService } from './auth.service'
import { TokenResponseDto } from './dto/auth-response.dto'
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
  async login(@Req() req: IRequest): Promise<TokenResponseDto> {
    return await this.service.login(req.user)
  }

  @Delete()
  async logout(@Sign() sign: ISign): Promise<MessageDto> {
    return await this.service.logout(sign.sub)
  }
}
