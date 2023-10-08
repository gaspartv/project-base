import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator'
import {
  Delete,
  Post
} from '@nestjs/common/decorators/http/request-mapping.decorator'
import {
  Body,
  Req
} from '@nestjs/common/decorators/http/route-params.decorator'
import { ApiTags } from '@nestjs/swagger'
import { IsPublic } from '../../common/decorators/custom/is-public.decorator'
import { Sign } from '../../common/decorators/param/sign.decorator'
import { MessageDto } from '../../common/dto/message.dto'
import { ISign } from '../../common/interfaces/jwt-payload.interface'
import { IRequest } from '../../common/interfaces/request.interface'
import { UserResponseEntity } from '../users/entities/user.entity'
import { AuthService } from './auth.service'
import { LocalAuth } from './decorators/local-auth.decorator'
import { RequestLoginDto } from './dto/request/request-login.dto'
import { ResponseLoginDto } from './dto/response/response-login.dto'

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
    @Body() _body: RequestLoginDto
  ): Promise<ResponseLoginDto> {
    const user: UserResponseEntity = req.user

    return await this.service.login(user)
  }

  @Delete()
  async logout(@Sign() sign: ISign): Promise<MessageDto> {
    const userId: string = sign.sub

    return await this.service.logout(userId)
  }
}
