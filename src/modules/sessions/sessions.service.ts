import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { GeneratorDate } from '../../common/utils/generator-date'
import { UsersService } from '../users/users.service'
import { SessionCreateDto } from './dto/create-session.dto'
import { SessionEntity, SessionResponseEntity } from './entities/session.entity'
import { SessionsRepository } from './repositories/sessions.repository'

@Injectable()
export class SessionsService {
  constructor(
    private readonly repository: SessionsRepository,
    private readonly usersService: UsersService
  ) {}

  async create(dto: SessionCreateDto): Promise<SessionResponseEntity> {
    await this.usersService.userOrThrow(dto.userId)

    const expiresAt: Date = GeneratorDate.expiresAt()

    const entity: SessionEntity = new SessionEntity({
      userId: dto.userId,
      expiresAt: expiresAt,
      tokens: []
    })

    return await this.repository.create(entity)
  }

  async disconnectedMany(userId: string): Promise<{ count: number }> {
    await this.usersService.userOrThrow(userId)

    return await this.repository.disconnectedMany(userId)
  }
}
