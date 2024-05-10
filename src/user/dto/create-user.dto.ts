import { IsNotEmpty, IsEmail, MinLength, IsArray } from "class-validator";
import {Address} from '../entities/user.entity'
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
  @IsArray()
  addresses:Address[]
}