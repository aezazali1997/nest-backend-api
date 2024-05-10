import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { JwtModule } from "@nestjs/jwt";
import { UserService } from './user/user.service';
import { User, UserSchema } from './user/entities/user.entity';



@Module({
  imports: [ConfigModule.forRoot(),MongooseModule.forRoot(process.env.DATABASE_URL), 
  
  
   MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }]),
   JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.EXPIRY },
    }), UserModule],
  controllers: [AppController],
  providers: [AppService,UserService, AuthService,],
})
export class AppModule {}
