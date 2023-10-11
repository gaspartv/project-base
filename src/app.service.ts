import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Cron } from '@nestjs/schedule'
import * as fs from 'fs'
import { join } from 'path'
import { mainDirname } from './root-dirname'

@Injectable()
export class AppService {
  @Cron('0 0 * * *')
  deleteFilesInErrorFileGenerator() {
    const folderPath = mainDirname + '/tmp/error/file-generator'
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = join(folderPath, file)
      fs.unlinkSync(filePath)
    })
  }

  @Cron('0 0 * * *')
  deleteFilesInTrash() {
    const folderPath = mainDirname + '/tmp/trash'
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = join(folderPath, file)
      fs.unlinkSync(filePath)
    })
  }
}
