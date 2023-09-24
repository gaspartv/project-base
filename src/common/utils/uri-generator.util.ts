import { join } from 'path'
import { MessageFileDto } from '../../modules/users/dto/update-photo-user.dto'
import { mainDirname } from '../../root-dirname'

export async function uriGenerator(file: MessageFileDto): Promise<string> {
  const imageUri: string = `${file.tempFilePath}.${file.mimetype.split('/')[1]}`

  const dbUri: string = imageUri.split(/\\|\//)[1]

  const filePath: string = join(mainDirname, 'tmp', 'avatar', dbUri)

  await file.mv(filePath)

  return dbUri
}
