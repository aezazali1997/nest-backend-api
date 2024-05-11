import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JwtModule, JwtService } from "@nestjs/jwt";
import { User, UserSchema } from './user/entities/user.entity';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [ConfigModule.forRoot(
  ),MongooseModule.forRoot(process.env.DATABASE_URL), 
   MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }]),
     
    UserModule,AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
