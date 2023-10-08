import { Injectable } from '@nestjs/common'
import { UserResponseEntity } from '../../users/entities/user.entity'

@Injectable()
export abstract class AuthRepository {
  abstract findOneUser(login: string): Promise<UserResponseEntity>
}
