import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) userDto: CreateUserDto,
  ): Promise<UserDocument> {
    try {
      return await this.authService.register(userDto);
    } catch (error: any) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
  @Post('login')
  async login(
    @Body(ValidationPipe) loginData: LoginDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(loginData);
  }
}
