import AppError, { NOT_FOUND } from '../../../common/errors/AppError'

export class PassTokenNotFoundError extends AppError {
  constructor() {
    super('pass token not found', NOT_FOUND)
  }
}
