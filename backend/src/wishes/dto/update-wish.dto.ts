import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './create-wish.dto';
import { IsInt, IsNumber, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @IsOptional()
  @IsInt()
  copied: number;

  @IsOptional()
  @Length(1, 1024)
  description: string;
}
