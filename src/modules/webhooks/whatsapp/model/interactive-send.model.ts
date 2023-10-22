import { ReplyButtonId } from './reply-button-id'

class Body {
  text: string // Emojis and markdown are supported. Maximum length: 1024 characters.
}

class Footer {
  text: string // Emojis, markdown, and links are supported. Maximum length: 60 characters.
}

class Header {
  document?: any // Required if type is document.
  image?: any // Required if type is image.
  text?: string // Required if type is text. Maximum length: 60 characters.
  type: 'text' | 'video' | 'image' | 'document'
  video?: any // Required if type is set to video.
}

class Reply {
  title: string // It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
  id: ReplyButtonId // Maximum length: 256 characters. returned in the webhook when the button is clicked by the user.
}

class Button {
  type: 'reply'
  reply?: Reply // Required for Reply Buttons.
}

class Row {
  // id: ReplyListId; // Maximum length: 200 characters
  id: string // Maximum length: 200 characters
  title: string // Maximum length: 24 characters
  description?: string // Maximum length: 72 characters
}

class Product {
  product_retailer_id: string
}

class Section {
  product_items?: Product[] // Required for Multi-Product Messages.
  rows: Row[] // Required for List Messages.
  title: string // Required if the message has more than one section. Maximum length: 24 characters.
}

class Action {
  button?: string // Required for List Messages. Maximum length: 20 characters.
  buttons?: Button[] // Required for Reply Buttons.
  catalog_id?: string // Required for Single Product Messages and Multi-Product Messages.
  product_retailer_id?: string // Required for Single Product Messages and Multi-Product Messages.
  sections?: Section[] // Required for List Messages and Multi-Product Messages. Minimum of 1, maximum of 10.
}

export class InteractiveSendModel {
  action: Action
  body?: Body | undefined // Optional for type product. Required for other message types.
  footer?: Footer
  header?: Header // Required for type product_list. Optional for other types.  cannot set a header if type = product.
  type: 'button' | 'catalog_message' | 'list' | 'product' | 'product_list'
}
