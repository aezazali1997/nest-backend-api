import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Get()
  healthCheck(): string {
    return 'hello world';
  }
  @Post('db/seed')
  async seed(@Body() data) {
    const users: CreateUserDto[] = [];
    for (let i = 0; i < data.usersCount; i++) {
      const createdUser = await this.createUser();

      users.push(createdUser);
    }

    await Promise.all(users.map((user) => this.userService.create(user)));
    return 'Seeding completed';
  }
  private async createUser(): Promise<CreateUserDto> {
    const hashedPassword = await bcrypt.hash('hashedPassword', 10);

    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
      role: 'user',

      addresses: [
        {
          addressLine1: faker.location.streetAddress(),
          addressLine2: faker.location.secondaryAddress(),
          state: faker.location.state(),
          city: faker.location.city(),
          country: faker.location.country(),
          role: 'shipping',
          phoneNo: faker.phone.number(),
        },
      ],
    };
    return user;
  }
}
