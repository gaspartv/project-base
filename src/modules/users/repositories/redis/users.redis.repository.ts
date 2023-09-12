import { Injectable } from '@nestjs/common'
import { RedisService } from '../../../../recipes/redis/redis.service'
import { VerifyUniqueFieldUserDto } from '../../dto/verify-unique-field.dto'
import { CreateUserEntity } from '../../entities/create-user.entity'
import { UpdatePhotoUserEntity } from '../../entities/update-photo-user.entity'
import { UpdateUserEntity } from '../../entities/update-user.entity'
import { UserEntity } from '../../entities/user.entity'
import { UsersPrismaRepository } from '../prisma/users.prisma.repository'
import { UsersRepository } from '../users.repository'

@Injectable()
export class UsersRedisRepository implements UsersRepository {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: UsersPrismaRepository
  ) {}

  async create(entity: CreateUserEntity): Promise<UserEntity> {
    const user: UserEntity = await this.prisma.create(entity)
    await this.redis.set(user.id, JSON.stringify(user))
    return user
  }

  async update(id: string, entity: UpdateUserEntity): Promise<UserEntity> {
    const user: UserEntity = await this.prisma.update(id, entity)
    await this.redis.set(user.id, JSON.stringify(user))
    return user
  }

  async updatePhoto(
    id: string,
    entity: UpdatePhotoUserEntity
  ): Promise<UserEntity> {
    const user: UserEntity = await this.prisma.updatePhoto(id, entity)
    await this.redis.set(user.id, JSON.stringify(user))
    return user
  }

  async findOne(id: string): Promise<UserEntity> {
    const userCached: string = await this.redis.get(id)
    if (userCached) return JSON.parse(userCached)
    const user: UserEntity = await this.prisma.findOne(id)
    await this.redis.set(user.id, JSON.stringify(user))
    return user
  }

  async verifyUniqueFieldToCreated(
    dto: VerifyUniqueFieldUserDto
  ): Promise<VerifyUniqueFieldUserDto> {
    return await this.prisma.verifyUniqueFieldToCreated(dto)
  }

  async verifyUniqueFieldToUpdate(
    id: string,
    dto: VerifyUniqueFieldUserDto
  ): Promise<VerifyUniqueFieldUserDto> {
    return await this.prisma.verifyUniqueFieldToUpdate(id, dto)
  }
}
