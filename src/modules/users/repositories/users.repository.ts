import { UserPaginationDto } from '../dto/request/pagination-user.dto'
import { UserVerifyUniqueFieldDto } from '../dto/verify-unique-field.dto'
import { UserWhereDto } from '../dto/where-user.dto'
import { UserEntity, UserResponseEntity } from '../entities/user.entity'

export abstract class UsersRepository {
  abstract create(entity: UserEntity): Promise<UserResponseEntity>

  abstract update(entity: UserEntity): Promise<UserResponseEntity>

  abstract findOne(id: string): Promise<UserResponseEntity>

  abstract findOneWhere(where: UserWhereDto): Promise<UserResponseEntity>

  abstract findMany(options: UserPaginationDto): Promise<UserResponseEntity[]>

  abstract count(options: UserPaginationDto): Promise<number>

  abstract verifyUniqueFieldToCreated(
    dto: UserVerifyUniqueFieldDto
  ): Promise<UserVerifyUniqueFieldDto>

  abstract verifyUniqueFieldToUpdate(
    id: string,
    dto: UserVerifyUniqueFieldDto
  ): Promise<UserVerifyUniqueFieldDto>

  abstract findOneByLogin(login: string): Promise<UserResponseEntity>
}
