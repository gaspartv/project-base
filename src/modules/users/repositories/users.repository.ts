import { UserPaginationDto } from '../dto/pagination-user.dto'
import { UserVerifyUniqueFieldDto } from '../dto/verify-unique-field.dto'
import { UserWhereDto } from '../dto/where-user.dto'
import { UserEntity } from '../entities/user.entity'

export abstract class UsersRepository {
  abstract create(entity: UserEntity): Promise<UserEntity>

  abstract update(entity: UserEntity): Promise<UserEntity>

  abstract findOne(id: string): Promise<UserEntity>

  abstract findOneWhere(where: UserWhereDto): Promise<UserEntity>

  abstract findMany(options: UserPaginationDto): Promise<UserEntity[]>

  abstract count(options: UserPaginationDto): Promise<number>

  abstract verifyUniqueFieldToCreated(
    dto: UserVerifyUniqueFieldDto
  ): Promise<UserVerifyUniqueFieldDto>

  abstract verifyUniqueFieldToUpdate(
    id: string,
    dto: UserVerifyUniqueFieldDto
  ): Promise<UserVerifyUniqueFieldDto>
}
