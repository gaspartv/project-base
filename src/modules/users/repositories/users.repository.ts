import { VerifyUniqueFieldUserDto } from '../dto/verify-unique-field.dto'
import { WhereUserDto } from '../dto/where-user.dto'
import { UserEntity, UserResponseEntity } from '../entities/user.entity'

export abstract class UsersRepository {
  abstract create(entity: UserEntity): Promise<UserResponseEntity>

  abstract update(entity: UserEntity): Promise<UserResponseEntity>

  abstract findOne(id: string): Promise<UserResponseEntity>

  abstract findOneWhere(where: WhereUserDto): Promise<UserResponseEntity>

  abstract verifyUniqueFieldToCreated(
    dto: VerifyUniqueFieldUserDto
  ): Promise<VerifyUniqueFieldUserDto>

  abstract verifyUniqueFieldToUpdate(
    id: string,
    dto: VerifyUniqueFieldUserDto
  ): Promise<VerifyUniqueFieldUserDto>
}
