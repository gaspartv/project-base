import { IsObject } from 'class-validator'

interface User {
  imageUri: string
}

export class UpdatePhotoUserEntity {
  constructor(user: User) {
    this.imageUri = user.imageUri
  }

  imageUri: string
}

export class CreateMessageFileDto {
  @IsObject()
  file: MessageFileDto
}

export interface MessageFileDto {
  name: string
  data: {
    type: string
    data: any[]
  }
  size: number
  encoding: string
  tempFilePath: string
  truncated: false
  mimetype: string
  md5: string
  mv(...args: unknown[]): unknown
}
