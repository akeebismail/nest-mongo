import { EntityRepository } from '../@commons/entities/entity.repository';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class UserRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }
}
