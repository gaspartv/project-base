import { EmailTemplateCreateUserDto } from './dto/request/email-template-create-user.dto'
import { EmailTemplateRecoveryUserDto } from './dto/request/email-template-recovery-user.dto'
import { ResponseEmail } from './dto/response/email-response.dto'

export class EmailGenerate {
  static createUser(dto: EmailTemplateCreateUserDto): ResponseEmail {
    const { passToken, urlFront } = dto

    return {
      subject: 'tibia-info.com - conta criada com sucesso!',
      html: `<strong>Crie sua Senha </strong> <a href="${urlFront}/change-password/${passToken}" >clicando aqui</a>.\n\nEquipe Tibia-Info.`
    }
  }

  static passUserRecovery(dto: EmailTemplateRecoveryUserDto): ResponseEmail {
    const { passToken, urlFront } = dto

    return {
      subject: `tibia-info.com - recuperação de senha.`,
      html: `<strong>Recupere sua Senha, </strong><a href="${urlFront}/change-password/${passToken}"><strong>clicando aqui</strong> </a>.\n\nOu copie a URL e cole no navegador: <a href="${urlFront}/change-password/${passToken}">${urlFront}/change-password/${passToken} </a>\n\nEquipe Tibia-Info.`
    }
  }
}
