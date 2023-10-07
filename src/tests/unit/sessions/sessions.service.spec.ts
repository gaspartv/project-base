import { Test, TestingModule } from '@nestjs/testing'
import { randomUUID } from 'crypto'
import { SessionCreateDto } from '../../../modules/sessions/dto/create-session.dto'
import { SessionsFakeRepository } from '../../../modules/sessions/repositories/fake/sessions.fake.repository'
import { SessionsRepository } from '../../../modules/sessions/repositories/sessions.repository'
import { SessionsService } from '../../../modules/sessions/sessions.service'
import { UsersRepository } from '../../../modules/users/repositories/users.repository'

describe('SessionsService', () => {
  let service: SessionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: SessionsRepository, useClass: SessionsFakeRepository },
        { provide: UsersRepository, useValue: { findOne: jest.fn() } }
      ]
    }).compile()

    service = module.get<SessionsService>(SessionsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a new session', async () => {
    const userId = randomUUID()

    const dto: SessionCreateDto = { userId }

    const session = await service.create(dto)

    expect(session).toBeDefined()

    const expectedProperties = [
      'id',
      'connectedAt',
      'disconnectedAt',
      'expiresAt',
      'tokens',
      'userId'
    ]

    expectedProperties.forEach((property) => {
      expect(session).toHaveProperty(property)
    })

    for (const prop in session) {
      expect(expectedProperties).toContain(prop)
    }
  })

  it('should call disconnectedMany on the repository', async () => {
    const userId = randomUUID()

    const dto: SessionCreateDto = { userId }

    await service.create(dto)
    await service.create(dto)

    const { count } = await service.disconnectedMany(userId)

    expect(count).toBeDefined()
    expect(count).toEqual(2)
  })
})
