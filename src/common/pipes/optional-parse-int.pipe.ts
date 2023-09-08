import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ParseIntPipe,
  PipeTransform
} from '@nestjs/common'

@Injectable()
export class OptionalParseIntPipe
  extends ParseIntPipe
  implements PipeTransform
{
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (value === undefined || value === null) {
        return value
      } else {
        return super.transform(value, metadata)
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        return undefined
      } else {
        throw error
      }
    }
  }
}
