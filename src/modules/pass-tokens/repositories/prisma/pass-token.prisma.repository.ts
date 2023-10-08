import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../../../config/prisma/prisma.service'
import {
  PassTokenEntity,
  ResponsePassTokenEntity
} from '../../entity/pass-token.entity'
import { PassTokenRepository } from '../pass-tokens.repository'

@Injectable()
export class PassTokenPrismaRepository implements PassTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  private include = {
    User: true
  }

  async create(entity: PassTokenEntity): Promise<ResponsePassTokenEntity> {
    return await this.prisma.passToken.create({
      data: entity,
      include: this.include
    })
  }

  async update(entity: PassTokenEntity): Promise<ResponsePassTokenEntity> {
    return await this.prisma.passToken.update({
      where: { id: entity.id },
      data: entity,
      include: this.include
    })
  }

  async findLastRequest(userId: string): Promise<ResponsePassTokenEntity> {
    return await this.prisma.passToken.findFirst({
      where: {
        userId: userId,
        usedAt: null,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: this.include
    })
  }

  async revokedMany(userId: string): Promise<{ count: number }> {
    return await this.prisma.passToken.updateMany({
      where: {
        userId: userId,
        usedAt: null,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      data: {
        revokedAt: new Date()
      }
    })
  }

  async findOneWhere(
    where: Prisma.PassTokenWhereInput
  ): Promise<ResponsePassTokenEntity> {
    return await this.prisma.passToken.findFirst({
      where,
      include: this.include
    })
  }
}
