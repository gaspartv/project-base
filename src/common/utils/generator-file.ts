import { unlinkSync } from 'fs'
import { join } from 'path'
import { MessageFileDto } from '../../modules/users/dto/request/update-user-photo.dto'
import { mainDirname } from '../../root-dirname'
import { TMP, WriteFile } from './write-file'

export class GeneratorFile {
  public static async save(file: MessageFileDto): Promise<string> {
    const imageUri: string = `${file.tempFilePath}.${
      file.mimetype.split('/')[1]
    }`

    const dbUri: string = imageUri.split(/\\|\//)[1]

    try {
      const filePath: string = join(mainDirname, 'tmp', 'avatar', dbUri)

      await file.mv(filePath)

      return dbUri
    } catch (error) {
      console.log(error)
    }
  }

  public static remove(dbUri: string): void {
    try {
      const filePath: string = join(mainDirname, 'tmp', 'avatar', dbUri)

      unlinkSync(filePath)
    } catch (error) {
      // WriteFile.of(error)
      //   .type(TMP.FILE_GENERATOR)
      //   .path('error')
      //   .prefix('file-generator')
      //   .write()
    }
  }
}
