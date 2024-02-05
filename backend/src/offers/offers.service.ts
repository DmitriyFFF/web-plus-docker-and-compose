import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateWishDto } from 'src/wishes/dto/update-wish.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishService.findOne(createOfferDto.itemId);

    if (user.id === wish.owner.id) {
      throw new ForbiddenException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }

    if (createOfferDto.amount > wish.price) {
      throw new ForbiddenException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    await this.wishService.update(wish.id, wish.owner.id, {
      raised: createOfferDto.amount,
    } as UpdateWishDto);

    return this.offerRepository.save({ ...createOfferDto, user, item: wish });
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: {
        id,
      },
    });

    return offer;
  }
}
