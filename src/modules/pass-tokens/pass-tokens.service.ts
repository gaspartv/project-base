import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { GeneratorDate } from '../../common/utils/generator-date'
import { EmailProvider } from '../../providers/email/email.provider'
import {
  PassTokenEntity,
  ResponsePassTokenEntity
} from './entity/pass-token.entity'
import { PassTokenRepository } from './repositories/pass-tokens.repository'

@Injectable()
export class PassTokensService {
  constructor(private readonly repository: PassTokenRepository) {}

  async create(userId: string): Promise<ResponsePassTokenEntity> {
    const lastRequest: ResponsePassTokenEntity =
      await this.findLastRequest(userId)

    if (lastRequest) {
      const checkTimeSinceLastRequest: number = GeneratorDate.minutesDiff(
        lastRequest.createdAt
      )

      if (checkTimeSinceLastRequest < 5) {
        throw new NotFoundException('password token not found')
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
      throw new NotFoundException('password token not found')
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
      throw new ConflictException('password token not validated')
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
    EmailProvider.recoveryPass({ email, passTokenId })

    if (process.env.NODE_ENV === 'dev') {
      console.info(passTokenId)
    }

    return
  }
}
