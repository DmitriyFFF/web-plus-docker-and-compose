import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishRepository.create({ ...createWishDto, owner });

    return this.wishRepository.save(wish);
  }

  async findLast() {
    const wishes = await this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    return wishes;
  }

  async findTop() {
    const wishes = await this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
    });

    return wishes;
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });

    return wish;
  }
  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id);

    if (wish.raised) {
      throw new ForbiddenException(
        'Нельзя изменять стоимость, если уже есть желающие скинуться',
      );
    }

    if (userId === wish.owner.id) {
      return await this.wishRepository.update(id, updateWishDto);
    } else {
      throw new ForbiddenException('Невозможно редактировать чужие подарки');
    }
  }

  async removeOne(id: number, userId: number) {
    const wish = await this.findOne(id);

    if (userId === wish.owner.id) {
      return await this.wishRepository.delete(id);
    } else {
      throw new ForbiddenException('Невозможно удалить чужие подарки');
    }
  }

  async copyWish(id: number, user: User) {
    const wish = await this.findOne(id);

    await this.wishRepository.update(id, {
      copied: (wish.copied += 1),
    });

    return this.wishRepository.save({
      ...wish,
      owner: user,
    });
  }
}
