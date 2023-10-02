import { UserEntity } from '../../../users/entities/user.entity'
import { ResponsePassTokenEntity } from '../../entity/pass-token.entity'

export class PassTokenDto {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly expiresAt: Date
  readonly revokedAt: Date | null
  readonly usedAt: Date | null
  readonly userId: string
  readonly User: UserEntity

  constructor(props: PassTokenDto) {
    this.id = props.id
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
    this.expiresAt = props.expiresAt
    this.revokedAt = props.revokedAt
    this.usedAt = props.usedAt
    this.userId = props.userId
    this.User = props.User
  }

  static handle(entity: ResponsePassTokenEntity): PassTokenDto {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      expiresAt: entity.expiresAt,
      revokedAt: entity.revokedAt,
      usedAt: entity.usedAt,
      userId: entity.userId,
      User: entity.User
    }
  }
}
