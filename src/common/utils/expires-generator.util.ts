import 'dotenv/config'

export function expiresAtGenerator(): Date {
  const dateNow: Date = new Date()

  dateNow.setTime(dateNow.getTime() + Number(process.env.JWT_EXPIRES_IN) * 1000)

  return dateNow
}
