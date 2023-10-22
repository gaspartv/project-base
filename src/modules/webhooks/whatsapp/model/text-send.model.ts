/**
 * Negrito = Asterisco ( * ) \
 * Itálico = Sublinhado ( _ ) \
 * Riscado = Til ( ~ ) \
 * Code = Três acentos graves ( ``` )
 */
export class TextSendModel {
  body?: string // Required for text messages. Maximum length: 4096 characters
  preview_url?: boolean // Cloud API only. render a link preview of any URL in the body text string.
}
