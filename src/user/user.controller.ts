import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ExtendedRequest } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Req() req: ExtendedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    try {
      return await this.userService.findAll(req.user.email, page, limit);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: ExtendedRequest) {
    try {
      return this.userService.findOne(req.user, id);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: ExtendedRequest,
  ) {
    try {
      return this.userService.update(req.user, id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: ExtendedRequest) {
    try {
      return this.userService.remove(req.user, id);
    } catch (error) {
      throw error;
    }
  }
}
