import { Test, TestingModule } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { UserEntity } from './entities/user.entity'
import {
  userCreateEntityMock,
  userCreateMock,
  userCreateToUpdateMock
} from './repositories/fake/mocks/users-create.mock'
import { UsersFakeRepository } from './repositories/fake/users.fake.repository'
import { UsersRepository } from './repositories/users.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
  let controller: UsersController

  const expectedProperties = [
    'id',
    'createdAt',
    'updatedAt',
    'disabledAt',
    'deletedAt',
    'firstName',
    'lastName',
    'email',
    'phone',
    'passwordHash',
    'description',
    'imageUri',
    'darkMode',
    'language'
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: UsersRepository, useClass: UsersFakeRepository }
      ]
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should be create new user', async () => {
    const body = await controller.create(userCreateMock)

    expect(body).toBeDefined()

    expectedProperties.forEach((property) => {
      expect(body).toHaveProperty(property)
    })

    for (const prop in body) {
      expect(expectedProperties).toContain(prop)
    }
  })

  it('should be update user', async () => {
    const passwordHash = await hash(
      userCreateToUpdateMock.password,
      Number(process.env.HASH_SALT)
    )

    const userEntity = new UserEntity({
      ...userCreateToUpdateMock,
      passwordHash
    })

    console.log(userEntity)

    const userCreate = await controller.create({
      ...userCreateEntityMock,
      ...userEntity
    })

    const body = await controller.update(userCreate.id, userEntity)

    expect(body).toBeDefined()

    expectedProperties.forEach((property) => {
      expect(body).toHaveProperty(property)
    })

    for (const prop in body) {
      expect(expectedProperties).toContain(prop)
    }
  })
})
