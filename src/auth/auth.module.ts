import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants/auth.constants';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    UserModule,
      JwtModule.register({
        global:true,
        secret:'secrey-key-101',
        signOptions:{
          expiresIn:'1h'
        }
      })
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}