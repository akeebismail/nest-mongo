import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/*
class  Device{
    @Prop()
    current: string

    @Prop()
    previous: string[]
}
const DeviceSchema = SchemaFactory.createForClass(Device)
*/
@Schema({ timestamps: true })
export class User {
  @Prop()
  phone: string;

  @Prop()
  phoneVerifiedAt?: Date;

  @Prop()
  phoneVerified?: boolean;

  @Prop()
  countryPhone?: string;

  @Prop()
  currentLocation?: string; // this will determine which kyc/feature the user can access

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  otherNames?: string;

  @Prop()
  email?: string;

  @Prop()
  emailVerifiedAt?: Date;

  @Prop()
  emailVerified?: boolean;
  @Prop()
  password?: string;

  @Prop(
    raw({
      current: String,
      previous: { type: [String] },
      reason: String,
    }),
  )
  device?: Record<string, any>;
  @Prop()
  referredBy?: string; // no much info for now
  @Prop()
  userTags?: string[];

  @Prop()
  status?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  birthCountry?: string;

  @Prop()
  birthState?: string;

  @Prop()
  gender?: string;

  @Prop()
  nationality?: string;

  @Prop(
    raw([
      {
        question: String,
        answer: String,
      },
    ]),
  )
  security?: Record<string, string>[]; // [{question: '', answer: ''}]

  @Prop()
  lastLoggedInAt?: Date;
  @Prop()
  lockedUntil?: Date;

  @Prop()
  avatar: string;

  @Prop()
  iso2: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
