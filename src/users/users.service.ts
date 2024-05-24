import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // todo: add params to have search query
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserBy(field: string, value: any): Promise<User | null> {
    return await this.userRepository.findOneBy({ [field]: value });
  }

  async saveUser(user: User): Promise<void> {
    await this.userRepository.insert(user);
  }
}
