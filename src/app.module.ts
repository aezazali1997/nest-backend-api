import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { User, UserSchema } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import {
  Organization,
  OrganizationSchema,
} from './organization/entities/organization.entity';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
    ]),

    UserModule,
    OrganizationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
