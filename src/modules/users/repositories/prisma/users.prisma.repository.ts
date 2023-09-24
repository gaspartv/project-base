import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../../../recipes/prisma/prisma.service'
import { VerifyUniqueFieldUserDto } from '../../dto/verify-unique-field.dto'
import { WhereUserDto } from '../../dto/where-user.dto'
import { UserEntity, UserResponseEntity } from '../../entities/user.entity'
import { UsersRepository } from '../users.repository'

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private include: Prisma.UserInclude = {
    Sessions: true
  }

  async create(entity: UserEntity): Promise<UserResponseEntity> {
    return await this.prisma.user.create({
      data: entity,
      include: this.include
    })
  }

  async update(entity: UserEntity): Promise<UserResponseEntity> {
    return await this.prisma.user.update({
      where: { id: entity.id },
      data: entity,
      include: this.include
    })
  }

  async findOne(id: string): Promise<UserResponseEntity> {
    return await this.prisma.user.findUnique({
      where: { id, deletedAt: null, disabledAt: null },
      include: this.include
    })
  }

  async verifyUniqueFieldToCreated(
    dto: VerifyUniqueFieldUserDto
  ): Promise<VerifyUniqueFieldUserDto> {
    return await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
      select: { email: true, phone: true }
    })
  }

  async verifyUniqueFieldToUpdate(
    id: string,
    dto: VerifyUniqueFieldUserDto
  ): Promise<VerifyUniqueFieldUserDto> {
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

  async findOneWhere(where: WhereUserDto): Promise<UserResponseEntity> {
    return await this.prisma.user.findFirst({
      where,
      include: this.include
    })
  }
}