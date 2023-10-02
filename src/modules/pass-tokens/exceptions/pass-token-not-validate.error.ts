import AppError, { NOT_FOUND } from '../../../common/errors/AppError'

export class PassTokenNotValidateError extends AppError {
  constructor() {
    super('pass token not validate', NOT_FOUND)
  }
}
