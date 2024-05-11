import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationDocument,
} from './entities/organization.entity';
import { Model } from 'mongoose';
import { Payload } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/dto/create-user.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  create(user: Payload, createOrganizationDto: CreateOrganizationDto) {
    if (user.role === UserRole.USER) {
      throw new ForbiddenException('Access Issue');
    }
    const createdOrganization = new this.organizationModel(
      createOrganizationDto,
    );
    return createdOrganization.save();
  }

  findAll(user: Payload) {
    if (user.role === UserRole.USER) {
      throw new ForbiddenException('Access Issue');
    }
    return this.organizationModel.find().exec();
  }

  async remove(user: Payload, id: string) {
    const organization = await this.organizationModel.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (user.role === UserRole.USER) {
      throw new ForbiddenException('Access Issue');
    }
    return this.organizationModel.findByIdAndDelete(id);
  }
}
