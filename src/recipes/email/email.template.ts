import { EmailCreateUserDto } from './dto/email-create-user.dto'
import { EmailRecoveryUserDto } from './dto/email-recovery-user.dto'

export class EmailGenerate {
  static createUser(dto: EmailCreateUserDto) {
    const { passToken, urlFront } = dto

    return {
      subject: 'tibia-info.com - conta criada com sucesso!',
      html: `<strong>Crie sua Senha </strong> <a href="${urlFront}/change-password/${passToken}" >clicando aqui</a>.\n\nEquipe Tibia-Info.`
    }
  }

  static passUserRecovery(dto: EmailRecoveryUserDto) {
    const { passToken, urlFront } = dto

    return {
      subject: `tibia-info.com - recuperação de senha.`,
      html: `<strong>Recupere sua Senha, </strong><a href="${urlFront}/change-password/${passToken}"><strong>clicando aqui</strong> </a>.\n\nOu copie a URL e cole no navegador: <a href="${urlFront}/change-password/${passToken}">${urlFront}/change-password/${passToken} </a>\n\nEquipe Tibia-Info.`
    }
  }
}
