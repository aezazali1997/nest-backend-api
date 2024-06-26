import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UserDocument } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    return await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });
  }

  async login(
    userDto: LoginDto,
  ): Promise<{ accessToken: string; role: string }> {
    const user = await this.userService.findByEmail(userDto.email);

    if (!user || !(await bcrypt.compare(userDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, role: user.role };
  }
  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
