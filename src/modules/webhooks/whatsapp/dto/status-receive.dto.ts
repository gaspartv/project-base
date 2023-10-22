interface OriginReceiveDto {
  type: string
}

interface conversationReceiveDto {
  id: string
  expiration_timestamp?: string // Sent messages only.
  origin: OriginReceiveDto
}

interface PricingReceiveDto {
  billable: boolean
  pricing_model: string
  category: string
}

export type StatusReceive = 'delivered' | 'sent' | 'read'

export interface StatusReceiveDto {
  id: string
  status: StatusReceive
  timestamp: string
  recipient_id: string
  conversation?: conversationReceiveDto // Sent and Delivered messages only.
  pricing?: PricingReceiveDto // Sent and Delivered messages only.
}
