import { Test } from '@nestjs/testing/test'
import { TestingModule } from '@nestjs/testing/testing-module'
import { userCreateMock } from '../../../modules/users/repositories/fake/mocks/users-create.mock'
import { UsersFakeRepository } from '../../../modules/users/repositories/fake/users.fake.repository'
import { UsersRepository } from '../../../modules/users/repositories/users.repository'
import { UsersController } from '../../../modules/users/users.controller'
import { UsersService } from '../../../modules/users/users.service'

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

  // it('should be update user', async () => {
  //   const passwordHash = await hash(
  //     userCreateToUpdateMock.password,
  //     Number(process.env.HASH_SALT)
  //   )

  //   const userEntity = new UserEntity({
  //     ...userCreateToUpdateMock,
  //     passwordHash
  //   })

  //   const userCreate = await controller.create({
  //     ...userCreateEntityMock,
  //     ...userEntity
  //   })

  //   const updatedUserEntity = new UserEntity({
  //     ...userEntity,
  //     id: userCreate.id
  //   })

  //   const body = await controller.update(userCreate.id, updatedUserEntity)

  //   expect(body).toBeDefined()

  //   expectedProperties.forEach((property) => {
  //     expect(body).toHaveProperty(property)
  //   })

  //   for (const prop in body) {
  //     expect(expectedProperties).toContain(prop)
  //   }
  // })
})
