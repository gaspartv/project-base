export interface IPayload {
  iat?: number
  exp?: number
  sign: ISign
}

export interface IApplication {
  sign: ISign
}

export interface ISign {
  sub: string
  sessionId: string
}
