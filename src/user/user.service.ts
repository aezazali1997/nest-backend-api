import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Payload } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(email: string, page: number = 1, limit: number = 10) {
    const user: any = await this.userModel.findOne({
      email,
    });
    const users = await this.userModel
      .find({
        role: 'user',
        organizationId: user.organizationId,
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({
        updatedAt: 'desc',
      });
    // only include organizations related

    if (!users || !Array.isArray(users)) {
      throw new HttpException('Record Not Found', 200);
    }
    return users;
  }

  async findOne(userPayload: Payload, id: string) {
    // logged in user email and role
    const { email, role } = userPayload;
    // user for specific id
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User Not Found', 200);
    }
    // check if user is a normal user
    if (role === UserRole.USER) {
      // restrict if someone trying to access some other user info
      if (user.email !== email) {
        throw new ForbiddenException('Access Issue');
      }
    }
    return user;
  }

  async update(userPayload: Payload, id: string, updateUserDto: UpdateUserDto) {
    // logged in user email and role
    const { email, role } = userPayload;
    // user for specific id
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check if user is a normal user
    if (role === UserRole.USER) {
      // restrict if someone trying to access some other user info

      if (user.email !== email) {
        throw new ForbiddenException('Access Issue');
      }
    }

    for (const key of Object.keys(updateUserDto)) {
      console.log('key', key);
      if (key === 'password') {
        const hashedPassword = await bcrypt.hash(updateUserDto[key], 10);
        user[key] = hashedPassword;
      } else {
        user[key] = updateUserDto[key];
      }
    }

    const newUser = await user.save();
    return newUser;
  }

  async remove(userPayload: Payload, id: string) {
    // logged in user email and role
    const { email, role } = userPayload;
    // user for specific id
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // check if user is a normal user
    if (role === UserRole.USER) {
      // restrict if someone trying to access some other user info
      if (user.email !== email) {
        throw new ForbiddenException('Access Issue');
      }
    }

    return this.userModel.findByIdAndDelete(id);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
