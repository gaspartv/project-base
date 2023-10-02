import { Prisma } from '@prisma/client'
import {
  PassTokenEntity,
  ResponsePassTokenEntity
} from '../entity/pass-token.entity'

export abstract class PassTokenRepository {
  abstract create(entity: PassTokenEntity): Promise<ResponsePassTokenEntity>

  abstract update(entity: PassTokenEntity): Promise<ResponsePassTokenEntity>

  abstract findLastRequest(userId: string): Promise<ResponsePassTokenEntity>

  abstract revokedMany(userId: string): Promise<{ count: number }>

  abstract findOneWhere(
    where: Prisma.PassTokenWhereInput
  ): Promise<ResponsePassTokenEntity>
}
