import { ContextSendModel } from './context-send.model'
import { InteractiveSendModel } from './interactive-send.model'
import { LocationModel } from './location-send.model'
import { MediaModel } from './media-send.model'
import { ReactionModel } from './reaction-send.model'
import { TemplateSendModel } from './template-send.model'
import { TextSendModel } from './text-send.model'

type Type =
  | 'text' /* padrão */
  | 'image'
  | 'audio'
  | 'video'
  | 'document'
  | 'reaction'
  | 'interactive'
  | 'location'
  | 'template' /* use para enviar um modelo de mensagem de mídia */
  | 'hsm'

export class SendMessageSendModel {
  type?: Type // Obrigatório para modelos de mensagem.
  to: string // Id
  ttl?: string // Padrão: 7 dias (1 a 30 dias) somente segundos. As durações devem ser especificadas em exatos múltiplos de dias.
  messaging_product: string
  recipient_type?: string // Contém todas as informações de modelo.
  context?: ContextSendModel // Reply message
  template?: TemplateSendModel // Obrigatório para mensagens de template.
  image?: MediaModel // Obrigatório para type=image.
  video?: MediaModel // Obrigatório para type=video.
  audio?: MediaModel // Obrigatório para type=audio.
  document?: MediaModel // Obrigatório para type=document.
  location?: LocationModel // Obrigatório para type=location.
  reaction?: ReactionModel // Obrigatório para type=reaction.
  interactive?: InteractiveSendModel // Obrigatório para type=interactive.
  text?: TextSendModel // Obrigatório para type=text.
  hsm?: any // Obrigatório para modelos de mensagem.
}
