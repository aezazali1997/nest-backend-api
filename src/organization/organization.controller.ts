import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ExtendedRequest } from 'src/user/entities/user.entity';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Req() req: ExtendedRequest,
  ) {
    return this.organizationService.create(req.user, createOrganizationDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: ExtendedRequest) {
    return this.organizationService.findAll(req.user);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: ExtendedRequest) {
    return this.organizationService.remove(req.user, id);
  }
}
