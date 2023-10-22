class Email {
  email?: string
  type?: string // Standard values are HOME and WORK.
}

class Address {
  street?: string // Street number and name.
  city?: string // City name.
  state?: string // State abbreviation.
  zip?: string // ZIP code.
  country?: string // Full country name.
  country_code?: string // Two-letter country abbreviation.
  type?: string // Standard values are HOME and WORK.
}

class Name {
  formatted_name: string // Required. Full name, as it normally appears.
  first_name?: string
  last_name?: string
  middle_name?: string
  suffix?: string
  prefix?: string
}

class Org {
  company?: string // Name of the contact's company.
  department?: string // Name of the contact's department.
  title?: string // Contact's business title.
}

class Phone {
  phone?: string // Automatically populated with the `wa_id` value as a formatted phone number.
  type?: string // Standard Values are CELL, MAIN, IPHONE, HOME, and WORK.
  wa_id?: string // WhatsApp ID.
}

class Url {
  url?: string // URL.
  type?: string // Standard values are HOME and WORK.
}

export class ContactSendModel {
  addresses?: Address
  birthday?: string // YYYY-MM-DD formatted string.
  emails?: Email[]
  name: Name // At least one of the optional parameters needs to be included along with the formatted_name parameter.
  org?: Org
  phones?: Phone[]
  urls?: Url[]
}
