import { SetMetadata } from '@nestjs/common/decorators/core/set-metadata.decorator'

export const IS_PUBLIC_KEY = 'isPublic'
export function IsPublic() {
  return SetMetadata(IS_PUBLIC_KEY, true)
}
