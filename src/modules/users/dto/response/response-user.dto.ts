import { ELanguage, EUserPolice } from '@prisma/client';
import { UserResponseEntity } from '../../user.entity';

export class UserResponseDto {
  constructor(user: UserResponseDto) {
    this.id = user.id;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.disabledAt = user.disabledAt;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
    this.description = user.description;
    this.imageUrl = user.imageUrl;
    this.settings = user.settings;
    this.police = user.police;
  }

  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly disabledAt: Date | null;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly description: string | null;
  readonly imageUrl: string | null;
  readonly police: EUserPolice;
  readonly settings: UserSettingsResponseDto;

  static handle(entity: UserResponseEntity): UserResponseDto {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      disabledAt: entity.disabledAt,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      phone: entity.phone,
      description: entity.description,
      imageUrl: process.env.URL_BACKEND + 'tmp/avatar/' + entity.imageUri,
      police: entity.police,
      settings: {
        language: entity.language,
        darkMode: entity.darkMode
      }
    };
  }
}

class UserSettingsResponseDto {
  readonly language: ELanguage;
  readonly darkMode: boolean;
}
