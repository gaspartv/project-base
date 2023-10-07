import { GeneratorDate } from '../../common/utils/generator-date'

describe('Utils service', () => {
  it('expires generator', () => {
    expect(GeneratorDate.expiresAt()).toBeInstanceOf(Date)
  })

  it('minutes diff, send startDate', () => {
    const end = new Date()
    end.setDate(end.getDate() + 1)

    const start = new Date()

    const res = GeneratorDate.minutesDiff(end, start)

    expect(res).toBeDefined()
    expect(res).toEqual(1440)
  })

  it('minutes diff, not startDate', () => {
    const end = new Date()
    end.setDate(end.getDate() + 1)

    const res = GeneratorDate.minutesDiff(end)

    expect(res).toBeDefined()
    expect(res).toEqual(1440)
  })

  it('minutes diff, endDate negative', () => {
    const end = new Date()
    end.setDate(end.getDate() - 15)

    const res = GeneratorDate.minutesDiff(end)

    expect(res).toBeDefined()
    expect(res).toBeLessThan(0)
  })
})
