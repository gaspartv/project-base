import { Injectable } from '@nestjs/common'
import { UserNotFoundError } from '../../../../common/errors/not-found/UserNotFound.error'
import { RedisService } from '../../../../recipes/redis/redis.service'
import { UserPaginationDto } from '../../dto/request/pagination-user.dto'
import { UserVerifyUniqueFieldDto } from '../../dto/verify-unique-field.dto'
import { UserWhereDto } from '../../dto/where-user.dto'
import { UserEntity } from '../../entities/user.entity'
import { UsersPrismaRepository } from '../prisma/users.prisma.repository'
import { UsersRepository } from '../users.repository'

@Injectable()
export class UsersRedisRepository implements UsersRepository {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: UsersPrismaRepository
  ) {}

  private prefixEntity: string = 'user:'
  private prefixEntities: string = 'users:'

  async create(entity: UserEntity): Promise<UserEntity> {
    const user: UserEntity = await this.prisma.create(entity)

    const key: string = this.prefixEntity + user.id

    const value: string = JSON.stringify(user)

    await this.redis.set(key, value, 'EX', 86400)

    await this.redis.clean(this.prefixEntities)

    return new UserEntity(user)
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    const user: UserEntity = await this.prisma.update(entity)

    const key: string = this.prefixEntity + user.id

    const value: string = JSON.stringify(user)

    await this.redis.set(key, value, 'EX', 86400)

    await this.redis.clean(this.prefixEntities)

    return new UserEntity(user)
  }

  async findOne(id: string): Promise<UserEntity> {
    const key: string = this.prefixEntity + id

    const userCached: string = await this.redis.get(key)

    if (userCached) {
      return JSON.parse(userCached)
    }

    const user = await this.prisma.findOne(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    const value: string = JSON.stringify(user)

    await this.redis.set(key, value, 'EX', 86400)

    return new UserEntity(user)
  }

  async verifyUniqueFieldToCreated(
    dto: UserVerifyUniqueFieldDto
  ): Promise<UserVerifyUniqueFieldDto> {
    return await this.prisma.verifyUniqueFieldToCreated(dto)
  }

  async verifyUniqueFieldToUpdate(
    id: string,
    dto: UserVerifyUniqueFieldDto
  ): Promise<UserVerifyUniqueFieldDto> {
    return await this.prisma.verifyUniqueFieldToUpdate(id, dto)
  }

  async findOneWhere(where: UserWhereDto): Promise<UserEntity> {
    const user: UserEntity = await this.prisma.findOneWhere(where)

    if (!user) {
      throw new UserNotFoundError()
    }

    const key: string = this.prefixEntity + user.id

    const value: string = JSON.stringify(user)

    await this.redis.set(key, value, 'EX', 86400)

    return new UserEntity(user)
  }

  async findMany(options: UserPaginationDto): Promise<UserEntity[]> {
    const key = this.prefixEntities + JSON.stringify(options)

    const usersCached = await this.redis.get(key)

    if (usersCached) {
      return JSON.parse(usersCached)
    }

    const users = await this.prisma.findMany(options)

    const value = JSON.stringify(users)

    await this.redis.set(key, value, 'EX', 86400)

    return users.map((user) => new UserEntity(user))
  }

  async count(options: UserPaginationDto): Promise<number> {
    const key = this.prefixEntities + 'count' + JSON.stringify(options)

    const usersCached = await this.redis.get(key)

    if (usersCached) {
      return Number(JSON.parse(usersCached))
    }

    const users = await this.prisma.count(options)

    const value = JSON.stringify(users)

    await this.redis.set(key, value, 'EX', 86400)

    return Number(value)
  }
}
