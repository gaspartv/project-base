import { faker } from '@faker-js/faker'
import { Test, TestingModule } from '@nestjs/testing'
import { UserCreateDto } from '../../../modules/users/dto/request/create-user.dto'
import { UserResponseEntity } from '../../../modules/users/entities/user.entity'
import { UsersFakeRepository } from '../../../modules/users/repositories/fake/users.fake.repository'
import { UsersRepository } from '../../../modules/users/repositories/users.repository'
import { UsersService } from '../../../modules/users/users.service'

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useClass: UsersFakeRepository }
      ]
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should be created new user', async () => {
    const dto: UserCreateDto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      description: faker.person.bio(),
      phone: faker.phone.number('###########'),
      email: faker.internet.email(),
      login: 'gaspar_text',
      cpf: '12345678901',
      darkMode: true,
      language: 'PT_BR'
    }

    const user: UserResponseEntity = await service.create(dto)

    expect(user).toBeDefined()

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

    expectedProperties.forEach((property) => {
      expect(user).toHaveProperty(property)
    })

    for (const prop in user) {
      expect(expectedProperties).toContain(prop)
    }
  })

  it('cannot create user with repeated keys', async () => {
    const dto: UserCreateDto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      description: faker.person.bio(),
      phone: faker.phone.number('###########'),
      email: faker.internet.email(),
      login: 'gaspar_text',
      cpf: '12345678901',
      darkMode: true,
      language: 'PT_BR'
    }

    const user1: UserResponseEntity = await service.create(dto)
    const user2: UserResponseEntity = await service.create(dto)
  })
})
