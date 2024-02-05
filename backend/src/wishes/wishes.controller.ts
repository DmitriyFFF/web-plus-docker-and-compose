import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() req,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.create(req.user, createWishDto);
  }

  @Get('last')
  async findLast() {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async findTop() {
    return await this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wish> {
    const wish = await this.wishesService.findOne(id);
    if (!wish) {
      throw new NotFoundException('Подарок отсутствует!');
    } else {
      return wish;
    }
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findOne(id);
    if (!wish) {
      throw new NotFoundException('Подарок отсутствует!');
    }
    return this.wishesService.update(id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeOne(@Req() req, @Param('id') id: number) {
    const wish = await this.wishesService.findOne(id);
    if (!wish) {
      throw new NotFoundException('Подарок отсутствует!');
    }
    return this.wishesService.removeOne(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() req, @Param('id') id: number) {
    return await this.wishesService.copyWish(id, req.user);
  }
}
