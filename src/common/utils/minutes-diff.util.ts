export function minutesDiff(end: Date, start?: Date): number {
  const dateStart = start ? new Date(start).getTime() : new Date().getTime()

  const dateEnd = new Date(end).getTime()

  const diff = Math.abs(dateStart - dateEnd)

  return Math.ceil(diff / (1000 * 60))
}
