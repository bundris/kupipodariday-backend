import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @Length(0, 1500)
  @IsString()
  @IsOptional()
  description: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
