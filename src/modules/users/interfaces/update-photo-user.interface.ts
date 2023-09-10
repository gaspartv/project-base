import { IsObject } from 'class-validator'

export class UpdatePhotoUserInterface {
  @IsObject()
  data: UpdatePhotoUserData
}

export interface UpdatePhotoUserData {
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
