export enum BooleanQuery {
  TRUE = 'true',
  FALSE = 'false'
}

export function isBooleanQuery(value: string): boolean {
  return value === BooleanQuery.TRUE || value === BooleanQuery.FALSE
}
