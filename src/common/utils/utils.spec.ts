import { expiresAtGenerator } from './expires-generator.util'
import { minutesDiff } from './minutes-diff.util'

describe('Utils service', () => {
  it('expires generator', () => {
    expect(expiresAtGenerator()).toBeInstanceOf(Date)
  })

  it('minutes diff, send startDate', () => {
    const end = new Date()
    end.setDate(end.getDate() + 1)

    const start = new Date()

    const res = minutesDiff(end, start)

    expect(res).toBeDefined()
    expect(res).toEqual(1440)
  })

  it('minutes diff, not startDate', () => {
    const end = new Date()
    end.setDate(end.getDate() + 1)

    const res = minutesDiff(end)

    expect(res).toBeDefined()
    expect(res).toEqual(1440)
  })

  it('minutes diff, endDate negative', () => {
    const end = new Date()
    end.setDate(end.getDate() - 15)

    const res = minutesDiff(end)

    expect(res).toBeDefined()
    expect(res).toBeLessThan(0)
  })
})
