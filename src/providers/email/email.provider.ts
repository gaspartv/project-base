import { Logger } from '@nestjs/common/services/logger.service'
import 'dotenv/config'
import * as nodemailer from 'nodemailer'
import { EmailGenerate } from './email.template'

export class EmailProvider {
  static recoveryPass(email: string, passTokenId: string): void {
    const urlFront = process.env.URL_FRONTEND

    const { html, subject } = EmailGenerate.passUserRecovery({
      urlFront,
      passToken: passTokenId
    })

    this.sendEmail(email, subject, html)

    return
  }

  static sendEmail(email: string, subject: string, html: string): void {
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
