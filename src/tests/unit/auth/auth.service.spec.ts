import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing/test'
import { TestingModule } from '@nestjs/testing/testing-module'
import { AuthService } from '../../../modules/auth/auth.service'
import { SessionsFakeRepository } from '../../../modules/sessions/repositories/fake/sessions.fake.repository'
import { SessionsRepository } from '../../../modules/sessions/repositories/sessions.repository'
import { UsersFakeRepository } from '../../../modules/users/repositories/fake/users.fake.repository'
import { UsersRepository } from '../../../modules/users/repositories/users.repository'

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
