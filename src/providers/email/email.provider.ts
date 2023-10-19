import { Logger } from '@nestjs/common/services/logger.service'
import 'dotenv/config'
import * as fs from 'fs'
import handlebars from 'handlebars'
import { createTransport } from 'nodemailer'
import { resolve } from 'path'
import { mainDirname } from '../../root-dirname'

class CreateUserDto {
  name: string
  email: string
  passTokenId: string
}

class RecoveryPassDto {
  name: string
  email: string
  passTokenId: string
}

class SendEmailDto {
  email: string
  subject: string
  html: string
}

export class EmailProvider {
  static async createUser(dto: CreateUserDto): Promise<void> {
    const { email, passTokenId, name } = dto

    const subject = `Recuperação de senha.`

    const createUserTemplate = resolve(
      mainDirname,
      'src',
      'providers',
      'email',
      'templates',
      'create-user.hbs'
    )

    const templateFileContent = await fs.promises.readFile(createUserTemplate, {
      encoding: 'utf-8'
    })

    const parseTemplate = handlebars.compile(templateFileContent)

    const urlFront: string = process.env.URL_FRONTEND

    const link = 'http://' + urlFront + '/change-password/' + passTokenId

    const variables = { name, link }

    const html = parseTemplate(variables)

    this.sendEmail({ email, subject, html })

    return
  }

  static async recoveryPass(dto: RecoveryPassDto): Promise<void> {
    const { email, passTokenId, name } = dto

    const subject = `Recuperação de senha.`

    const recoveryPassTemplate = resolve(
      mainDirname,
      'src',
      'providers',
      'email',
      'templates',
      'recovery-password.hbs'
    )

    const templateFileContent = await fs.promises.readFile(
      recoveryPassTemplate,
      { encoding: 'utf-8' }
    )

    const parseTemplate = handlebars.compile(templateFileContent)

    const urlFront: string = process.env.URL_FRONTEND

    const link = 'http://' + urlFront + '/change-password/' + passTokenId

    const variables = { name, link }

    const html = parseTemplate(variables)

    this.sendEmail({ email, subject, html })

    return
  }

  private static sendEmail(dto: SendEmailDto): void {
    const { email, html, subject } = dto

    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASSWORD
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT)

    const transporter = createTransport({
      host,
      port,
      auth: { user, pass }
    })

    transporter
      .sendMail({
        from: user,
        to: email,
        replyTo: email,
        subject,
        html
      })
      .then((res) => res)
      .catch((err) => Logger.error(err))

    return
  }
}
