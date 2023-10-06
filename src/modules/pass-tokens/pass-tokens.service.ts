import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { minutesDiff } from '../../common/utils/minutes-diff.util'
import { EmailService } from '../../recipes/email/email.service'
import {
  PassTokenEntity,
  ResponsePassTokenEntity
} from './entity/pass-token.entity'
import { PassTokenNotFoundError } from './exceptions/pass-token-not-found.error'
import { PassTokenNotValidateError } from './exceptions/pass-token-not-validate.error'
import { PassTokenRepository } from './repositories/pass-tokens.repository'

@Injectable()
export class PassTokensService {
  constructor(
    private readonly repository: PassTokenRepository,
    private readonly emailService: EmailService
  ) {}

  async create(userId: string): Promise<ResponsePassTokenEntity> {
    const lastRequest: ResponsePassTokenEntity =
      await this.findLastRequest(userId)

    if (lastRequest) {
      const checkTimeSinceLastRequest: number = minutesDiff(
        lastRequest.createdAt
      )

      if (checkTimeSinceLastRequest < 5) {
        throw new PassTokenNotFoundError()
      }
    }

    await this.repository.revokedMany(userId)

    const entity = new PassTokenEntity({
      expiresAt: new Date(Date.now() + Number(process.env.JWT_EXPIRES_IN)),
      userId: userId
    })

    return await this.repository.create(entity)
  }

  async findLastRequest(userId: string): Promise<ResponsePassTokenEntity> {
    const passToken: ResponsePassTokenEntity =
      await this.repository.findLastRequest(userId)

    if (passToken) {
      return passToken
    }

    return
  }

  async passTokenOrThrow(id: string): Promise<ResponsePassTokenEntity> {
    const passToken: ResponsePassTokenEntity =
      await this.repository.findOneWhere({ id })

    if (!passToken) {
      throw new PassTokenNotFoundError()
    }

    return passToken
  }

  async passTokenValidate(id: string): Promise<ResponsePassTokenEntity> {
    const passToken = await this.passTokenOrThrow(id)

    const passTokenNotValidate =
      !passToken.userId ||
      passToken.expiresAt < new Date() ||
      passToken.usedAt ||
      passToken.revokedAt

    if (passTokenNotValidate) {
      throw new PassTokenNotValidateError()
    }

    return passToken
  }

  async revoke(passTokenId: string): Promise<ResponsePassTokenEntity> {
    const passTokenFound = await this.passTokenOrThrow(passTokenId)

    const entity = new PassTokenEntity({
      ...passTokenFound,
      revokedAt: new Date()
    })

    return await this.repository.update(entity)
  }

  async recoveryPass(email: string, passTokenId: string) {
    this.emailService.recoveryPass(email, passTokenId)

    if (process.env.NODE_ENV === 'dev') {
      console.info(passTokenId)
    }

    return
  }
}
