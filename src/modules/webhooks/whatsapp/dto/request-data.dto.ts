import { MessageReceiveDto } from './message-receive.dto'

export class RequestDataDto {
  entryId: string
  changeField: 'messages'
  provider: 'whatsapp'
  business: {
    id: string
    phone: string
  }
  contact: {
    id: string
    name: string
  }
  message: MessageReceiveDto
}
