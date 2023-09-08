import AppError, { NOT_FOUND } from '../AppError'

export class UserNotFoundError extends AppError {
  constructor() {
    super('user not found', NOT_FOUND)
  }
}
