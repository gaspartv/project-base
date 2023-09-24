import AppError, { UNAUTHORIZED } from '../AppError'

export class LoginUnauthorizedError extends AppError {
  constructor() {
    super('login unauthorized', UNAUTHORIZED)
  }
}
