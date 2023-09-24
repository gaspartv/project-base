import AppError, { NOT_FOUND } from '../AppError'

export class SessionNotFoundError extends AppError {
  constructor() {
    super('session not found', NOT_FOUND)
  }
}
