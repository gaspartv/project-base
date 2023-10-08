import {
  CustomDecorator,
  SetMetadata
} from '@nestjs/common/decorators/core/set-metadata.decorator'

export const IS_PASSWORD_CHECK_REQUIRED = 'isPasswordCheckRequired'

export function CheckPassword(): CustomDecorator<string> {
  return SetMetadata(IS_PASSWORD_CHECK_REQUIRED, true)
}
