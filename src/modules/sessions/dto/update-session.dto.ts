import { PartialType } from '@nestjs/swagger/dist/type-helpers/partial-type.helper'
import { SessionCreateDto } from './create-session.dto'

export class SessionUpdateDto extends PartialType(SessionCreateDto) {}
