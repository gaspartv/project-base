import { VerifyUniqueFieldUserDto } from '../dto/verify-unique-field.dto'
import { CreateUserEntity } from '../entities/create-user.entity'
import { UpdateUserEntity } from '../entities/update-user.entity'
import { UserEntity } from '../entities/user.entity'

export abstract class UsersRepository {
  abstract create(entity: CreateUserEntity): Promise<UserEntity>

  abstract update(id: string, entity: UpdateUserEntity): Promise<UserEntity>

  abstract findOne(id: string): Promise<UserEntity | null>

  abstract verifyUniqueFieldToCreated(
    dto: VerifyUniqueFieldUserDto
  ): Promise<VerifyUniqueFieldUserDto | null>

  abstract verifyUniqueFieldToUpdate(
    id: string,
    dto: VerifyUniqueFieldUserDto
  ): Promise<VerifyUniqueFieldUserDto | null>
}
