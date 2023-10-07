import { Logger } from '@nestjs/common/services/logger.service'
import 'dotenv/config'
import * as nodemailer from 'nodemailer'
import { EmailCreateUserDto } from './dto/request/email-create-user.dto'
import { EmailSendDto } from './dto/request/email-send.dto'
import { EmailGenerate } from './email.template'

export class EmailProvider {
  static recoveryPass(dto: EmailCreateUserDto): void {
    const { email, passTokenId } = dto

    const urlFront: string = process.env.URL_FRONTEND

    const { html, subject } = EmailGenerate.passUserRecovery({
      urlFront,
      passToken: passTokenId
    })

    this.sendEmail({ email, subject, html })

    return
  }

  static sendEmail(dto: EmailSendDto): void {
    const { email, html, subject } = dto

    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASSWORD
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT)

    const transporter = nodemailer.createTransport({
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
