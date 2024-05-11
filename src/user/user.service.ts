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

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(email: string, page: number = 1, limit: number = 10) {
    const users = await this.userModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({
        updatedAt: 'desc',
      });
    if (!users || !Array.isArray(users)) {
      throw new HttpException('Record Not Found', 200);
    }
    return users;
  }

  async findOne(email: string, id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User Not Found', 200);
    }
    if (user.role === UserRole.USER) {
      if (user.email !== email) {
        throw new ForbiddenException('Access Issue');
      }
    }
    return user;
  }

  async update(email: string, id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === UserRole.USER) {
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

  async remove(email: string, id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === UserRole.USER) {
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
