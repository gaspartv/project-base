import { MediaModel } from './media-send.model'

class ButtonParameter {
  type: 'payload' | 'text'
  payload?: string // Required for quick_reply buttons.
  text?: string // Required for URL buttons. Developer-provided suffix that is appended to the predefined prefix URL in the template.
}

class Currency {
  fallback_value: string // Default text if localization fails.
  code: string // ISO 4217 currency code.
  amount_1000: number // Amount multiplied by 1000.
}

class DataTime {
  fallback_value: string // Default text. For Cloud API, we always use the fallback value, and we do not attempt to localize using other optional fields.
}

class Parameter {
  type: 'currency' | 'date_time' | 'document' | 'image' | 'text' | 'video' // For text-based templates, the only supported parameter types are currency, date_time, and text.
  text?: string /* 
    Required when type=text. 
    For the header component type: 60 characters 
    For the body component type:
      1024 characters if other component types are included
      32768 characters if body is the only component type included
  */
  currency?: Currency // Required when type=currency.
  date_time?: DataTime // Required when type=date_time.
  image?: MediaModel // Required when type=image. Captions not supported when used in a media template.
  document?: MediaModel // Required when type=document. Only PDF documents are supported for media-based message templates. Captions not supported when used in a media template.
  video?: MediaModel // Required when type=video. Captions not supported when used in a media template.
}

class Component {
  type: 'header' | 'body' | 'footer' | 'button'
  parameters?: (Parameter | ButtonParameter)[]
  sub_type?: 'url' | 'quick_reply' // Required when parameters=ButtonParameterVO.
  index?: string // Required when parameters=ButtonParameterVO. Index of the button in the button array. Buttons are indexed from 0.
}

class Language {
  code: 'pt_BR' | 'en'
}

export class TemplateSendModel {
  namespace?: string // associado à conta comercial do WhatsApp que controla o número de telefone
  name: string // nome do modelo
  language: Language
  components?: Component[]
}
