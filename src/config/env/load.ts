import { registerAs } from '@nestjs/config'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export enum NodeEnvironment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  @IsOptional()
  NODE_ENV: NodeEnvironment

  @IsString()
  @IsOptional()
  PORT_BACKEND: string

  @IsString()
  DATABASE_URL: string

  @IsString()
  JWT_SECRET: string

  @IsString()
  JWT_EXPIRES_IN: string

  @IsString()
  HASH_SALT: string
}

export const load = [
  registerAs('environments', () => ({
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || NodeEnvironment.DEVELOPMENT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    HASH_SALT: parseInt(process.env.HASH_SALT),
  })),
]
