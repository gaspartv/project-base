interface EmailReceiveDto {
  email?: string
  type?: string // Standard values are HOME and WORK.
}

interface AddressReceiveDto {
  street?: string // Street number and name.
  city?: string // City name.
  state?: string // State abbreviation.
  zip?: string // ZIP code.
  country?: string // Full country name.
  country_code?: string // Two-letter country abbreviation.
  type?: string // Standard values are HOME and WORK.
}

interface NameReceiveDto {
  formatted_name: string // Required. Full name, as it normally appears.
  first_name?: string
  last_name?: string
  middle_name?: string
  suffix?: string
  prefix?: string
}

interface OrgReceiveDto {
  company?: string // Name of the contact's company.
  department?: string // Name of the contact's department.
  title?: string // Contact's business title.
}

interface PhoneReceiveDto {
  phone?: string // Automatically populated with the `wa_id` value as a formatted phone number.
  type?: string // Standard Values are CELL, MAIN, IPHONE, HOME, and WORK.
  wa_id?: string // WhatsApp ID.
}

interface UrlReceiveDto {
  url?: string // URL.
  type?: string // Standard values are HOME and WORK.
}

export interface ContactReceiveDto {
  addresses?: AddressReceiveDto
  birthday?: string // YYYY-MM-DD formatted string.
  emails?: EmailReceiveDto[]
  name: NameReceiveDto // At least one of the optional parameters needs to be included along with the formatted_name parameter.
  org?: OrgReceiveDto
  phones?: PhoneReceiveDto[]
  urls?: UrlReceiveDto[]
}
