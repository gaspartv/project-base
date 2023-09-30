import { EmailCreateUserDto } from './dto/email-create-user.dto'
import { EmailRecoveryUserDto } from './dto/email-recovery-user.dto'

export class EmailGenerate {
  static createUser(dto: EmailCreateUserDto) {
    return {
      subject: 'tibia-info.com - conta criada com sucesso!',
      html: `<strong>Crie sua Senha </strong> <a href="${dto.frontEndUrl}/change-password/${dto.passwordToken}" >clicando aqui</a>.\n\nEquipe Tibia-Info.`
    }
  }

  static passwordUserRecovery(dto: EmailRecoveryUserDto) {
    return {
      subject: `tibia-info.com - recuperação de senha.`,
      html: `<strong>Recupere sua Senha, </strong><a href="${dto.frontEndUrl}/change-password/${dto.passwordToken}"><strong>clicando aqui</strong> </a>.\n\nOu copie a URL e cole no navegador: <a href="${dto.frontEndUrl}/change-password/${dto.passwordToken}">${dto.frontEndUrl}/change-password/${dto.passwordToken} </a>\n\nEquipe Tibia-Info.`
    }
  }
}
