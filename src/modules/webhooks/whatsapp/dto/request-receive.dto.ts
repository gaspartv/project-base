import { MessageReceiveDto } from './message-receive.dto'
import { StatusReceiveDto } from './status-receive.dto'

interface ProfileReceiveDto {
  name: string
}

export interface ValueContactReceiveDto {
  profile: ProfileReceiveDto
  wa_id: string
}

export interface MetadataReceiveDto {
  display_phone_number: string
  phone_number_id: string
}

export interface ValueReceiveDto {
  messaging_product: 'whatsapp'
  metadata: MetadataReceiveDto
  contacts?: ValueContactReceiveDto[] // if user send message
  messages?: MessageReceiveDto[] // if user send message
  statuses?: StatusReceiveDto[] // if receive status
}

interface ChangesReceiveDto {
  field: 'messages'
  value: ValueReceiveDto
}

interface EntryReceiveDto {
  id: string
  changes: ChangesReceiveDto[]
}

export interface RequestReceiveDto {
  object: 'whatsapp_business_account'
  entry: EntryReceiveDto[]
}

// const x = {
//   object: 'whatsapp_business_account',
//   entry: [
//     {
//       id: '105154368948606',
//       changes: [
//         {
//           value: {
//             messaging_product: 'whatsapp',
//             metadata: {
//               display_phone_number: '5521970786656',
//               phone_number_id: '106738082127442'
//             },
//             contacts: [
//               { profile: { name: 'Diego Gaspar' }, wa_id: '553298274714' }
//             ],
//             messages: [
//               {
//                 from: '553298274714',
//                 id: 'wamid.HBgMNTUzMjk4Mjc0NzE0FQIAEhggNjIwQ0JDNTY0NEEyMENGNjM1N0Q1QzFCQjJDRjgxN0YA',
//                 timestamp: '1697901776',
//                 text: { body: 'Oi' },
//                 type: 'text'
//               }
//             ]
//           },
//           field: 'messages'
//         }
//       ]
//     }
//   ]
// }
