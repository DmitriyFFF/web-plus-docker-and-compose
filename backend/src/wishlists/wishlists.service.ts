import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return this.wishListRepository.find();
  }

  async create(
    owner: User,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const wishList = this.wishListRepository.create({
      ...createWishlistDto,
      owner,
    });

    return await this.wishListRepository.save(wishList);
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishListRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });

    return wishlist;
  }

  async update(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishList = await this.findOne(id);

    if (userId === wishList.owner.id) {
      return await this.wishListRepository.update(id, updateWishlistDto);
    } else {
      throw new ForbiddenException(
        'Невозможно редактировать чужие списки подарков',
      );
    }
  }

  async removeOne(id: number, userId: number) {
    const wishList = await this.findOne(id);

    if (userId === wishList.owner.id) {
      return this.wishListRepository.delete(id);
    } else {
      throw new ForbiddenException('Невозможно удалить чужие списки подарков');
    }
  }
}
