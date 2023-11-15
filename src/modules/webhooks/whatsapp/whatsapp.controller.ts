import { HttpCode, HttpStatus } from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import {
  Get,
  Post
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Query
} from '@nestjs/common/decorators/http/route-params.decorator';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { Logger } from '@nestjs/common/services/logger.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { IsPublic } from '../../../common/decorators/custom/is-public.decorator';
import { RequestReceiveDto } from './dto/request-receive.dto';
import { WhatsappService } from './whatsapp.service';

@ApiExcludeController()
@Controller('whatsapp/webhook')
export class WhatsappController {
  constructor(private readonly service: WhatsappService) {}

  @IsPublic()
  @Get()
  get(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') verifyToken: string,
    @Query('hub.challenge') challenge: any
  ) {
    const subscribeMode = mode == 'subscribe';
    const tokenMatch = verifyToken == process.env.WHATSAPP_VERIFY_TOKEN;

    if (!subscribeMode || !tokenMatch) {
      Logger.error(
        'Failed validation whatsapp. Make sure the validation tokens match.'
      );
      throw new BadRequestException();
    }

    return challenge;
  }

  @IsPublic()
  @Post()
  @HttpCode(HttpStatus.OK)
  async post(@Body() dto: RequestReceiveDto) {
    if (dto.entry[0].changes[0].value.statuses) {
      return;
    }

    const data = this.service.handleDto(dto);

    try {
      this.service.execute(data);
    } catch (err: any) {
      Logger.error(err);
    }
  }
}
