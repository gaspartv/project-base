import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception'
import {
  ArgumentMetadata,
  PipeTransform
} from '@nestjs/common/interfaces/features/pipe-transform.interface'
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe'

@Injectable()
export class OptionalParseIntPipe
  extends ParseIntPipe
  implements PipeTransform
{
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
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
