export function expiresAtGenerator() {
  const dateNow = new Date()

  dateNow.setTime(dateNow.getTime() + Number(process.env.JWT_EXPIRES_IN))

  return dateNow
}
