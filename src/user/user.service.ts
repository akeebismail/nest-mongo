import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}
  create(createUserDto: CreateUserDto) {
    return this.userRepo.create(createUserDto);
  }

  findAll() {
    return this.userRepo.paginate();
  }

  findOne(id: string) {
    return this.userRepo.findById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepo.findByIdAndDelete(id);
  }
}
