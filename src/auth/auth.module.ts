import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants/auth.constants';
import { UserService } from 'src/user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
      JwtModule.register({
        global:true,
        secret:process.env.SECRET,
        signOptions:{
          expiresIn:process.env.EXPIRY
        }
      })
  ],
  providers: [ConfigService,AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}