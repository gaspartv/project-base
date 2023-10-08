import 'dotenv/config'

export class GeneratorDate {
  public static expiresAt(): Date {
    const dateNow: Date = new Date()

    const expires_in: number = Number(process.env.JWT_EXPIRES_IN) * 1000

    dateNow.setTime(dateNow.getTime() + expires_in)

    return dateNow
  }

  public static minutesDiff(end: Date, start?: Date): number {
    const dateStart: number = start
      ? new Date(start).getTime()
      : new Date().getTime()

    const dateEnd: number = new Date(end).getTime()

    const diff: number = dateEnd - dateStart

    return Math.ceil(diff / (1000 * 60))
  }
}
