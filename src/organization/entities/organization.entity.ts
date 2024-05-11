import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({
  timestamps: true,
})
export class Organization {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  bussinessEmail: string;

  @Prop({ required: true })
  ceo: string;

  @Prop({
    required: true,
  })
  bussinessPhone: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
