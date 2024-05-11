import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Address } from '../entities/user.entity';
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: string;

  @IsNotEmpty()
  @IsArray()
  addresses: Address[];
}
