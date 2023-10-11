import { Logger } from '@nestjs/common/services/logger.service'
import { unlinkSync, writeFile } from 'fs'
import { join } from 'path'
import shortUUID from 'short-uuid'
import { MessageFileDto } from '../../modules/users/dto/request/update-user-photo.dto'
import { mainDirname } from '../../root-dirname'

export class GeneratorFile {
  public static async save(file: MessageFileDto): Promise<string> {
    try {
      const fileName = shortUUID.generate()

      const extensionName = file.mimetype.split('/')[1]

      const dbUri: string = `avatar-${fileName}.${extensionName}`

      const filePath: string = join(mainDirname, 'tmp', 'avatar', dbUri)

      await file.mv(filePath)

      return dbUri
    } catch (error) {
      const date = new Date().getTime()

      const fileName = `${date}.file-generator.json`

      const path = join(mainDirname, 'tmp', 'error', 'file-generator', fileName)

      const file = JSON.stringify(error, null, 2)

      writeFile(path, file, (err) => {
        if (err) throw err

        Logger.log(`file-generator armazenado em ${path}`)
      })
    }
  }

  public static remove(dbUri: string): void {
    try {
      const filePath: string = join(mainDirname, 'tmp', 'avatar', dbUri)

      unlinkSync(filePath)
    } catch (error) {
      const date = new Date().getTime()

      const fileName = `${date}.file-generator.json`

      const path = join(mainDirname, 'tmp', 'error', 'file-generator', fileName)

      const file = JSON.stringify(error, null, 2)

      writeFile(path, file, (err) => {
        if (err) throw err

        Logger.log(`file-generator armazenado em ${path}`)
      })
    }
  }
}
