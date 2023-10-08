import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../../../config/prisma/prisma.service'
import {
  SessionEntity,
  SessionResponseEntity
} from '../../entities/session.entity'
import { SessionsRepository } from '../sessions.repository'

@Injectable()
export class SessionsPrismaRepository implements SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private include: Prisma.SessionInclude = {
    User: true
  }

  async create(entity: SessionEntity): Promise<SessionResponseEntity> {
    return await this.prisma.session.create({
      data: entity,
      include: this.include
    })
  }

  async update(
    id: string,
    entity: SessionEntity
  ): Promise<SessionResponseEntity> {
    return await this.prisma.session.update({
      where: { id },
      data: entity,
      include: this.include
    })
  }

  async findOneUnique(id: string): Promise<SessionResponseEntity> {
    return await this.prisma.session.findUnique({
      where: { id },
      include: this.include
    })
  }

  async findOneByUser(userId: string): Promise<SessionResponseEntity> {
    return await this.prisma.session.findFirst({
      where: { userId, disconnectedAt: null },
      include: this.include
    })
  }

  async disconnectedMany(userId: string): Promise<{ count: number }> {
    return await this.prisma.session.updateMany({
      where: {
        userId: userId,
        disconnectedAt: null
      },
      data: {
        disconnectedAt: new Date()
      }
    })
  }
}
