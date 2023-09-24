import AppError, { UNAUTHORIZED } from '../AppError'

export class InvalidTokenUnauthorizedError extends AppError {
  constructor() {
    super('invalid token', UNAUTHORIZED)
  }
}
