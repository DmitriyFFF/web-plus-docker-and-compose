import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { hashHelper } from 'src/helpers/hash-helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const { password, ...result } = user;
    const hash = await hashHelper.hashPassword(password);

    return await this.userRepository.save({ ...result, password: hash });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    return user;
  }

  async findMany({ query }: UpdateUserDto): Promise<User[]> {
    const user = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
    return user;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const hash = await hashHelper.hashPassword(updateUserDto.password);
      updateUserDto.password = hash;
    }
    await this.userRepository.update({ id }, updateUserDto);
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async removeOne(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getWishesById(id: number): Promise<Wish[]> {
    const { wishes } = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        wishes: true,
      },
    });
    return wishes;
  }

  async getWishesByUsername(username: string): Promise<Wish[]> {
    const { wishes } = await this.userRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: true,
      },
    });
    return wishes;
  }
}
