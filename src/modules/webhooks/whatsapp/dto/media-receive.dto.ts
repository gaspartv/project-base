export interface MediaDto {
  id?: string // Not required when type is text. Required when type is audio, document, image, sticker, or video and you are not using a link.
  link?: string // Not required when type is text. Required when type is audio, document, image, sticker, or video and you are not using an uploaded media ID (i.e. you are hosting the media asset on your public server).
  filename?: string // only with document media
  provider?: string // Only used for On-Premises API.
}
