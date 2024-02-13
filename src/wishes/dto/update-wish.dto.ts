import { IsNumber, IsOptional } from 'class-validator';

export class UpdateWishDto {
  @IsNumber()
  @IsOptional()
  raised?: number;

  @IsNumber()
  @IsOptional()
  price?: number;
}
