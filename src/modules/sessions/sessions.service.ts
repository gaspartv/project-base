import { Injectable } from '@nestjs/common'
import { expiresAtGenerator } from '../../common/utils/expires-generator.util'
import { UsersRepository } from '../users/repositories/users.repository'
import { CreateSessionDto } from './dto/create-session.dto'
import { SessionEntity, SessionResponseEntity } from './entities/session.entity'
import { SessionsRepository } from './repositories/sessions.repository'

@Injectable()
export class SessionsService {
  constructor(
    private readonly repository: SessionsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async create(dto: CreateSessionDto): Promise<SessionResponseEntity> {
    await this.usersRepository.findOne(dto.userId)

    const expiresAt: Date = expiresAtGenerator()

    const entity: SessionEntity = new SessionEntity({
      userId: dto.userId,
      expiresAt: expiresAt,
      tokens: []
    })

    return await this.repository.create(entity)
  }

  async disconnectedMany(userId: string): Promise<{ count: number }> {
    await this.usersRepository.findOne(userId)

    return await this.repository.disconnectedMany(userId)
  }
}
