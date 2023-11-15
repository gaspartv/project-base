import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { randomUUID } from 'crypto';
import { MessageDto } from '../../common/dto/message.dto';
import { PaginationUtil } from '../../common/pagination/pagination.util';
import { GeneratorDate } from '../../common/utils/generator-date';
import { GeneratorFile } from '../../common/utils/generator-file';
import { HashProvider } from '../../providers/hashing/hash.provider';
import {
  PassTokenEntity,
  ResponsePassTokenEntity
} from '../pass-tokens/entity/pass-token.entity';
import { PassTokenRepository } from '../pass-tokens/repositories/pass-tokens.repository';
import { UserCreateDto } from './dto/request/create-user.dto';
import { UserPaginationDto } from './dto/request/pagination-user.dto';
import { UserUpdateEmailDto } from './dto/request/update-user-email.dto';
import { MessageFileDto } from './dto/request/update-user-photo.dto';
import { UserUpdatePoliceDto } from './dto/request/update-user-police.dto';
import { UserUpdatePassResetDto } from './dto/request/update-user-reset-pass.dto';
import { UserUpdateSettingsDto } from './dto/request/update-user-settings.dto';
import { UserUpdateDto } from './dto/request/update-user.dto';
import { UserPaginationResponseDto } from './dto/response/response-pagination-user.dto';
import { UserResponseDto } from './dto/response/response-user.dto';
import { UserVerifyUniqueFieldUpdateDto } from './dto/verify-unique-field-update.dto';
import { UserVerifyUniqueFieldDto } from './dto/verify-unique-field.dto';
import { UsersRepository } from './repositories/users.repository';
import { UserEntity, UserResponseEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly passTokenRepository: PassTokenRepository
  ) {}

  async create(dto: UserCreateDto): Promise<UserResponseDto> {
    await this.verifyUniqueFieldToCreated(dto);

    const password: string = randomUUID().toString();

    const entity: UserEntity = new UserEntity({
      ...dto,
      password
    });

    const userCreate: UserResponseEntity = await this.repository.create(entity);

    return UserResponseDto.handle(userCreate);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const userFound: UserResponseEntity = await this.repository.findOneWhere({
      id,
      deletedAt: null,
      disabledAt: null
    });

    if (!userFound) {
      throw new NotFoundException('user not found');
    }

    return UserResponseDto.handle(userFound);
  }

  async findMany(
    options: UserPaginationDto
  ): Promise<UserPaginationResponseDto> {
    const users = await this.repository.findMany(options);

    const count = await this.repository.count(options);

    return PaginationUtil.result(
      users.map((user) => ({
        ...UserResponseDto.handle(user),
        settings: undefined
      })),
      options,
      count
    );
  }

  async enable(id: string): Promise<UserResponseDto> {
    const userFound: UserResponseEntity = await this.repository.findOneWhere({
      id,
      deletedAt: null
    });

    if (!userFound) throw new NotFoundException('user not found');

    const entity = new UserEntity({
      ...userFound,
      disabledAt: null
    });

    const user = await this.repository.update(entity);

    return UserResponseDto.handle(user);
  }

  async disable(id: string): Promise<UserResponseDto> {
    const userFound: UserResponseEntity = await this.repository.findOneWhere({
      id,
      deletedAt: null,
      disabledAt: null
    });

    if (!userFound) throw new NotFoundException('user not found');

    const entity = new UserEntity({
      ...userFound,
      disabledAt: new Date()
    });

    const user = await this.repository.update(entity);

    return UserResponseDto.handle(user);
  }

  async delete(id: string): Promise<MessageDto> {
    const userFound: UserResponseEntity = await this.repository.findOneWhere({
      id,
      deletedAt: null
    });

    if (!userFound) throw new NotFoundException('user not found');

    const entity = new UserEntity({
      ...userFound,
      disabledAt: new Date(),
      deletedAt: new Date()
    });

    await this.repository.update(entity);

    return { message: 'user deleted successfully' };
  }

  async update(id: string, dto: UserUpdateDto): Promise<UserResponseDto> {
    const userFound: UserResponseEntity = await this.repository.findOneWhere({
      id,
      deletedAt: null,
      disabledAt: null
    });

    if (!userFound) throw new NotFoundException('user not found');

    await this.verifyUniqueFieldToUpdate(id, {
      phone: dto.phone,
      login: dto.login,
      cpf: dto.cpf
    });

    const entity: UserEntity = new UserEntity({
      ...userFound,
      ...dto,
      updatedAt: new Date()
    });

    const userUpdate = await this.repository.update(entity);

    return UserResponseDto.handle(userUpdate);
  }

  async updatePhoto(
    id: string,
    file: MessageFileDto
  ): Promise<UserResponseDto> {
    const userFound: UserResponseEntity = await this.repository.findOneWhere({
      id,
      deletedAt: null,
      disabledAt: null
    });

    if (!userFound) throw new NotFoundException('user not found');

    if (userFound.imageUri) GeneratorFile.remove(userFound.imageUri);

    const imageUri: string = await GeneratorFile.save(file);

    const entity: UserEntity = new UserEntity({
      ...userFound,
      imageUri: imageUri,
      updatedAt: new Date()
    });

    const userUpdate = await this.repository.update(entity);

    return UserResponseDto.handle(userUpdate);
  }

  async updatePolice(
    dto: UserUpdatePoliceDto,
    id: string
  ): Promise<UserResponseDto> {
    const userFound: UserResponseEntity = await this.repository.findOneWhere({
      id,
      deletedAt: null,
      disabledAt: null
    });

    if (!userFound) throw new NotFoundException('user not found');

    const entity: UserEntity = new UserEntity({
      ...userFound,
      ...dto,
      updatedAt: new Date()
    });

    const userUpdate = await this.repository.update(entity);

    return UserResponseDto.handle(userUpdate);
  }

  async updateEmail(
    dto: UserUpdateEmailDto,
    id: string
  ): Promise<UserResponseDto> {
    const userFound: UserResponseEntity = await this.repository.findOneWhere({
      id,
      deletedAt: null,
      disabledAt: null
    });

    if (!userFound) throw new NotFoundException('user not found');

    await this.verifyUniqueFieldToUpdate(id, {
      email: dto.email
    });

    const entity: UserEntity = new UserEntity({
      ...userFound,
      ...dto,
      updatedAt: new Date()
    });

    const userUpdate = await this.repository.update(entity);

    return UserResponseDto.handle(userUpdate);
  }

  async updateSettings(
    dto: UserUpdateSettingsDto,
    id: string
  ): Promise<UserResponseDto> {
    const userFound: UserResponseEntity = await this.repository.findOneWhere({
      id,
      deletedAt: null,
      disabledAt: null
    });

    if (!userFound) throw new NotFoundException('user not found');

    const entity: UserEntity = new UserEntity({
      ...userFound,
      ...dto,
      updatedAt: new Date()
    });

    const userUpdate = await this.repository.update(entity);

    return UserResponseDto.handle(userUpdate);
  }

  async resetPass(
    passTokenId: string,
    dto: UserUpdatePassResetDto
  ): Promise<MessageDto> {
    const { confirmNewPassword, newPassword } = dto;

    if (newPassword !== confirmNewPassword) {
      throw new ConflictException('new password do not match');
    }

    const passToken = await this.passTokenRepository.findOneWhere({
      id: passTokenId
    });

    if (!passToken) {
      throw new NotFoundException('password token not found');
    }

    const passTokenNotValidate =
      !passToken.userId ||
      passToken.expiresAt < new Date() ||
      passToken.usedAt ||
      passToken.revokedAt;

    if (passTokenNotValidate) {
      throw new ConflictException('password token not validated');
    }

    const userId: string = passToken.userId;

    const userFound: UserResponseEntity = await this.repository.findOneWhere({
      id: userId,
      disabledAt: null,
      deletedAt: null
    });

    if (!userFound) {
      throw new NotFoundException('user not found');
    }

    HashProvider.passwordIsMatch(newPassword, userFound.passwordHash);

    const passwordHash: string = HashProvider.passwordHash(newPassword);

    const entity = new UserEntity({
      ...userFound,
      passwordHash: passwordHash
    });

    await this.repository.update(entity);

    const passTokenEntity = new PassTokenEntity({
      ...passToken,
      revokedAt: new Date()
    });

    await this.passTokenRepository.update(passTokenEntity);

    return { message: 'password updated successfully' };
  }

  async recoveryPass(email: string): Promise<MessageDto> {
    const user = await this.repository.findOneWhere({ email });

    if (!user) throw new NotFoundException('user not found');

    const lastRequest: ResponsePassTokenEntity =
      await this.passTokenRepository.findLastRequest(user.id);

    if (lastRequest) {
      const checkTimeSinceLastRequest: number = GeneratorDate.minutesDiff(
        lastRequest.createdAt
      );

      if (checkTimeSinceLastRequest < 5) {
        throw new NotFoundException('password token not found');
      }
    }

    await this.passTokenRepository.revokedMany(user.id);

    const passTokenEntity = new PassTokenEntity({
      expiresAt: new Date(Date.now() + Number(process.env.JWT_EXPIRES_IN)),
      userId: user.id
    });

    await this.passTokenRepository.create(passTokenEntity);

    return { message: 'password recovery successfully' };
  }

  /// EXTRA ///
  private async verifyUniqueFieldToCreated(
    dto: UserVerifyUniqueFieldDto
  ): Promise<void> {
    const { cpf, email, login, phone } = dto;

    const exceptions: string[] = [];

    const uniqueFields: UserVerifyUniqueFieldDto = {
      email,
      phone,
      login,
      cpf
    };

    const verifyUniqueKey: UserVerifyUniqueFieldDto =
      await this.repository.verifyUniqueFieldToCreated(uniqueFields);

    if (verifyUniqueKey) {
      if (verifyUniqueKey.email === email) {
        exceptions.push('email already exists');
      }

      if (verifyUniqueKey.phone === phone) {
        exceptions.push('phone already exists');
      }

      if (verifyUniqueKey.login === login) {
        exceptions.push('login already exists');
      }

      if (verifyUniqueKey.cpf === cpf) {
        exceptions.push('cpf already exists');
      }
    }

    if (exceptions.length > 0) {
      throw new ConflictException(exceptions);
    }

    return;
  }

  private async verifyUniqueFieldToUpdate(
    id: string,
    dto: UserVerifyUniqueFieldUpdateDto
  ): Promise<void> {
    const { cpf, email, login, phone } = dto;

    const exceptions: string[] = [];

    const uniqueFields: UserVerifyUniqueFieldUpdateDto = {
      email: email || undefined,
      phone: phone || undefined,
      login: login || undefined,
      cpf: cpf || undefined
    };

    const verifyUniqueKey: UserVerifyUniqueFieldDto =
      await this.repository.verifyUniqueFieldToUpdate(id, uniqueFields);

    if (verifyUniqueKey) {
      if (verifyUniqueKey.email === email) {
        exceptions.push('email already exists');
      }

      if (verifyUniqueKey.phone === phone) {
        exceptions.push('phone already exists');
      }

      if (verifyUniqueKey.login === login) {
        exceptions.push('login already exists');
      }

      if (verifyUniqueKey.cpf === cpf) {
        exceptions.push('cpf already exists');
      }
    }

    if (exceptions.length > 0) {
      throw new ConflictException(exceptions);
    }

    return;
  }
}
