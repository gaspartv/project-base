export function generateRequestNumber(): string {
  const alphaNumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''

  for (let i = 0; i < 9; i++) {
    const random = Math.floor(Math.random() * alphaNumeric.length)
    result += alphaNumeric.charAt(random)
  }

  return result
}
