import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../recipes/prisma/prisma.service'
import { VerifyUniqueFieldUserDto } from '../../dto/verify-unique-field.dto'
import { CreateUserEntity } from '../../entities/create-user.entity'
import { UpdatePhotoUserEntity } from '../../entities/update-photo-user.entity'
import { UpdateUserEntity } from '../../entities/update-user.entity'
import { UserEntity } from '../../entities/user.entity'
import { UsersRepository } from '../users.repository'

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: CreateUserEntity): Promise<UserEntity> {
    return await this.prisma.user.create({ data: entity })
  }

  async update(id: string, entity: UpdateUserEntity): Promise<UserEntity> {
    return await this.prisma.user.update({ where: { id }, data: entity })
  }

  async updatePhoto(
    id: string,
    entity: UpdatePhotoUserEntity
  ): Promise<UserEntity> {
    return await this.prisma.user.update({ where: { id }, data: entity })
  }

  async findOne(id: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({ where: { id } })
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
}
