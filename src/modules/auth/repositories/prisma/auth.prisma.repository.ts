import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../config/prisma/prisma.service'
import { UserResponseEntity } from '../../../users/entities/user.entity'
import { AuthRepository } from '../auth.repository'

@Injectable()
export class AuthPrismaRepository extends AuthRepository {
  constructor(private readonly prisma: PrismaService) {
    super()
  }

  async findOneUser(login: string): Promise<UserResponseEntity> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [
          { deletedAt: null, disabledAt: null, email: login },
          { deletedAt: null, disabledAt: null, phone: login },
          { deletedAt: null, disabledAt: null, cpf: login },
          { deletedAt: null, disabledAt: null, login }
        ]
      },
      include: {
        Sessions: {
          where: {
            disconnectedAt: null
          },
          take: 1
        }
      }
    })
  }
}
