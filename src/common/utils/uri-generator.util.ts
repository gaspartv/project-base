import { join } from 'path'
import { MessageFileDto } from '../../modules/users/dto/request/update-user-photo.dto'
import { mainDirname } from '../../root-dirname'

export async function uriGenerator(file: MessageFileDto): Promise<string> {
  console.log(file)
  const imageUri: string = `${file.tempFilePath}.${file.mimetype.split('/')[1]}`

  const dbUri: string = imageUri.split(/\\|\//)[1]

  const filePath: string = join(mainDirname, 'tmp', 'avatar', dbUri)

  await file.mv(filePath)

  return dbUri
}
