import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ['user', 'admin'],
  })
  role: string;

  @Prop({ required: true })
  addresses: Address[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export type Address = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  role: string;
  phoneNo: string;
};
