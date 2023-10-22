import { ReplyButtonId } from '../model/reply-button-id'
import { ReplyListId } from '../model/reply-list-id'

type TypeReceive =
  | 'button'
  | 'catalog_message'
  | 'list'
  | 'product'
  | 'product_list'
  | 'button_reply'
  | 'list_reply'

export interface ButtonReplyReceiveDto {
  id: ReplyButtonId
  title: string
}

export interface ListReplyReceiveDto {
  id: ReplyListId
  title: string
  description: string
}

export interface InteractiveReceiveDto {
  type: TypeReceive
  button_reply?: ButtonReplyReceiveDto // if is button_reply
  list_reply?: ListReplyReceiveDto // if is list_reply
}
