import { ContactReceiveDto } from './contact-receive.dto'
import { InteractiveReceiveDto } from './interactive-receive.dto'
import { LocationReceiveDto } from './location-receive.dto'
import { MediaDto } from './media-receive.dto'
import { ReactionReceiveDto } from './reaction-receive.dto'
import { StickerReceiveDto } from './sticker-receive.dto'
import { TextReceiveDto } from './text-receive.dto'
import { UnsupportedReceiveDto } from './unsupported-receive.dto'

export enum MessageReceiveType {
  TEXT = 'text',
  INTERACTIVE = 'interactive',
  LOCATION = 'location',
  VIDEO = 'video',
  IMAGE = 'image',
  DOCUMENT = 'document',
  STICKER = 'sticker',
  AUDIO = 'audio',
  CONTACTS = 'contacts',
  REACTION = 'reaction',
  UNSUPPORTED = 'unsupported'
}

export interface MessageReceiveDto {
  from: string
  id: string
  timestamp: string
  type?: MessageReceiveType // Obrigatório para modelos de mensagem.

  to: string // Id
  ttl?: string // Padrão: 7 dias (1 a 30 dias) somente segundos. As durações devem ser especificadas em exatos múltiplos de dias.

  image?: any //if type is image.
  video?: MediaDto // if type is video.
  audio?: MediaDto // if type is audio.
  document?: MediaDto // if type is document.
  location?: LocationReceiveDto // if type is location.
  reaction?: ReactionReceiveDto // if type is reaction.
  interactive?: InteractiveReceiveDto // if type is interactive.
  text?: TextReceiveDto // if type is text.
  contacts?: ContactReceiveDto[] // if type is contacts
  sticker?: StickerReceiveDto // if type is sticker
  errors?: UnsupportedReceiveDto[] // if type is unsupported
}
