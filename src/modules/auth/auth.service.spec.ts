import { JwtService } from '@nestjs/jwt/dist/jwt.service'
import { Test } from '@nestjs/testing/test'
import { TestingModule } from '@nestjs/testing/testing-module'
import { SessionsFakeRepository } from '../sessions/repositories/fake/sessions.fake.repository'
import { SessionsRepository } from '../sessions/repositories/sessions.repository'
import { UsersFakeRepository } from '../users/repositories/fake/users.fake.repository'
import { UsersRepository } from '../users/repositories/users.repository'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token')
          }
        },
        {
          provide: SessionsRepository,
          useClass: SessionsFakeRepository
        },
        {
          provide: UsersRepository,
          useClass: UsersFakeRepository
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
