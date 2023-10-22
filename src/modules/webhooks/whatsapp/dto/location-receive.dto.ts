export interface LocationReceiveDto {
  longitude: number
  latitude: number
  name?: string
  address?: string // Only displayed if name is present.
}
