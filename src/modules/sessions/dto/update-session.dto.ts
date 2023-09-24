import { PartialType } from '@nestjs/swagger'
import { SessionCreateDto } from './create-session.dto'

export class SessionUpdateDto extends PartialType(SessionCreateDto) {}
