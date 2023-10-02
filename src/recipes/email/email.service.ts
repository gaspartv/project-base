import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { EmailGenerate } from './email.template'

@Injectable()
export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      auth: {
        user: this.user,
        pass: this.pass
      }
    })
  }

  private readonly transporter: nodemailer.Transporter
  private readonly urlFront = process.env.URL_FRONTEND
  private readonly user = process.env.SMTP_USER
  private readonly pass = process.env.SMTP_PASSWORD
  private readonly host = process.env.SMTP_HOST
  private readonly port = Number(process.env.SMTP_PORT)

  recoveryPass(email: string, passTokenId: string) {
    const { html, subject } = EmailGenerate.passUserRecovery({
      urlFront: this.urlFront,
      passToken: passTokenId
    })

    this.sendEmail(email, subject, html)

    return
  }

  sendEmail(email: string, subject: string, html: string) {
    this.transporter
      .sendMail({
        from: this.user,
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
