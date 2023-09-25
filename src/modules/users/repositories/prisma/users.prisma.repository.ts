import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { BooleanQuery } from '../../../../common/enum/boolean-query.enum'
import { PrismaService } from '../../../../recipes/prisma/prisma.service'
import { UserPaginationDto } from '../../dto/pagination-user.dto'
import { UserVerifyUniqueFieldDto } from '../../dto/verify-unique-field.dto'
import { UserWhereDto } from '../../dto/where-user.dto'
import { UserEntity } from '../../entities/user.entity'
import { UsersRepository } from '../users.repository'

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private include: Prisma.UserInclude = {
    Sessions: true
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    return await this.prisma.user.create({
      data: entity,
      include: this.include
    })
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    return await this.prisma.user.update({
      where: { id: entity.id },
      data: entity,
      include: this.include
    })
  }

  async findOne(id: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: { id, deletedAt: null, disabledAt: null },
      include: this.include
    })
  }

  async verifyUniqueFieldToCreated(
    dto: UserVerifyUniqueFieldDto
  ): Promise<UserVerifyUniqueFieldDto> {
    return await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
      select: { email: true, phone: true }
    })
  }

  async verifyUniqueFieldToUpdate(
    id: string,
    dto: UserVerifyUniqueFieldDto
  ): Promise<UserVerifyUniqueFieldDto> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: { not: id }, email: dto.email },
          { id: { not: id }, phone: dto.phone }
        ]
      },
      select: { email: true, phone: true }
    })
  }

  async findOneWhere(where: UserWhereDto): Promise<UserEntity> {
    return await this.prisma.user.findFirst({
      where,
      include: this.include
    })
  }

  async findMany(options: UserPaginationDto): Promise<UserEntity[]> {
    return await this.prisma.user.findMany({
      where: {
        disabledAt:
          options.disabled === BooleanQuery.TRUE
            ? { not: null }
            : options.disabled === BooleanQuery.FALSE
            ? null
            : undefined,
        deletedAt:
          options.deletedAt === BooleanQuery.TRUE
            ? { not: null }
            : options.deletedAt === BooleanQuery.FALSE
            ? null
            : undefined
      },
      skip: Number(options.skip),
      take: Number(options.take),
      orderBy:
        options.orderBy === 'email'
          ? { email: options.sort === 'asc' ? 'asc' : 'desc' }
          : options.orderBy === 'firstName'
          ? { firstName: options.sort === 'asc' ? 'asc' : 'desc' }
          : options.orderBy === 'lastName'
          ? { lastName: options.sort === 'asc' ? 'asc' : 'desc' }
          : { email: 'asc' },
      include: this.include
    })
  }

  async count(options: UserPaginationDto): Promise<number> {
    return await this.prisma.user.count({
      where: {
        disabledAt:
          options.disabled === BooleanQuery.TRUE
            ? { not: null }
            : options.disabled === BooleanQuery.FALSE
            ? null
            : undefined,
        deletedAt:
          options.deletedAt === BooleanQuery.TRUE
            ? { not: null }
            : options.deletedAt === BooleanQuery.FALSE
            ? null
            : undefined
      }
    })
  }
}
