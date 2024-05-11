import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { UserService } from './user/user.service';
import { CreateUserDto, UserRole } from './user/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { OrganizationService } from './organization/organization.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Get()
  healthCheck(): string {
    return 'hello world';
  }
  @Post('db/seed')
  async seed(@Body() data) {
    const users: CreateUserDto[] = [];
    const organizations = await this.organizationService.findAll({
      email: faker.internet.email(),
      sub: faker.database.mongodbObjectId(),
      role: UserRole.ADMIN,
    });
    if (organizations.length < 1) {
      throw new HttpException(
        'No Organizations found for seeding the user',
        200,
      );
    }

    for (let i = 0; i < data.usersCount; i++) {
      const organization: any =
        organizations[Math.floor(Math.random() * organizations.length)];
      const createdUser = await this.createUser(organization._id.toString());
      users.push(createdUser);
    }

    await Promise.all(users.map((user) => this.userService.create(user)));
    return 'Seeding completed';
  }
  private async createUser(organizationId: string): Promise<CreateUserDto> {
    const hashedPassword = await bcrypt.hash('hashedPassword', 10);

    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
      role: 'user',
      organizationId,

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
