import AppError, { UNAUTHORIZED } from '../AppError'

export class InvalidCredentialUnauthorizedError extends AppError {
  constructor() {
    super('invalid credentials', UNAUTHORIZED)
  }
}
