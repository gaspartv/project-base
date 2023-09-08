import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { VerifyUniqueFieldUserDto } from './dto/verify-unique-field.dto'
import { CreateUserEntity } from './entities/create-user.entity'
import { ResponseUserEntity } from './entities/response-user.entity'
import { UpdateUserEntity } from './entities/update-user.entity'
import { UsersRepository } from './repositories/users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<ResponseUserEntity> {
    const exceptions = []

    const uniqueFields: VerifyUniqueFieldUserDto = {
      email: dto.email,
      phone: dto.phone
    }

    const verifyUniqueKey =
      await this.repository.verifyUniqueFieldToCreated(uniqueFields)

    if (verifyUniqueKey) {
      if (verifyUniqueKey.email === dto.email) {
        exceptions.push('email already exists')
      }

      if (verifyUniqueKey.phone === dto.phone) {
        exceptions.push('phone already exists')
      }
    }

    if (exceptions.length > 0) {
      throw new ConflictException(exceptions)
    }

    const entity = new CreateUserEntity({
      ...dto,
      passwordHash: await hash(dto.password, Number(process.env.HASH_SALT))
    })

    const userCreate = await this.repository.create(entity)

    return new ResponseUserEntity(userCreate)
  }

  async update(id: string, dto: UpdateUserDto): Promise<ResponseUserEntity> {
    const exceptions = []

    const uniqueFields: VerifyUniqueFieldUserDto = {
      email: dto.email || undefined,
      phone: dto.phone || undefined
    }

    const verifyUniqueKey = await this.repository.verifyUniqueFieldToUpdate(
      id,
      uniqueFields
    )

    if (verifyUniqueKey) {
      if (verifyUniqueKey.email === dto.email) {
        exceptions.push('email already exists')
      }

      if (verifyUniqueKey.phone === dto.phone) {
        exceptions.push('phone already exists')
      }
    }

    const userFound = await this.repository.findOne(id)

    if (!userFound) {
      exceptions.push('user not found')
    }

    if (exceptions.length > 0) {
      throw new ConflictException(exceptions)
    }

    const entity = new UpdateUserEntity({
      ...userFound,
      ...dto
    })

    const userCreate = await this.repository.update(id, entity)

    return new ResponseUserEntity(userCreate)
  }
}
