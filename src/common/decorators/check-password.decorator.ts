import { SetMetadata } from '@nestjs/common'

export const IS_PASSWORD_CHECK_REQUIRED = 'isPasswordCheckRequired'

export const CheckPassword = () => SetMetadata(IS_PASSWORD_CHECK_REQUIRED, true)
