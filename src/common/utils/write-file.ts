import { Logger } from '@nestjs/common/services/logger.service'
import { writeFile } from 'fs'
import { join } from 'path'
import { mainDirname } from 'src/root-dirname'

export enum TMP {
  FILE_GENERATOR = 'file-generator',
  OTHER = 'other'
}

export class WriteFile {
  private _data: any
  private _prefix = 'write'
  private _type: TMP = TMP.OTHER
  private _path = ''

  private constructor(data: any) {
    this._data = data
  }

  public static of(data: any) {
    return new WriteFile(data)
  }

  public type(type: TMP) {
    this._type = type
    return this
  }

  public prefix(prefix: string) {
    this._prefix = prefix
    return this
  }

  public path(...path: string[]) {
    this._path = join(...path)
    return this
  }

  public write() {
    const date = new Date().getTime()
    const fileName = `${date}.${this._prefix}.json`

    const path = join(mainDirname, 'tmp', this._type, this._path, fileName)

    const file = JSON.stringify(this._data, null, 2)

    writeFile(path, file, (err) => {
      if (err) throw err

      Logger.log(`${this._prefix} armazenado em ${path}`)
    })
  }
}
