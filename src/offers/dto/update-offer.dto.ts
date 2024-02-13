import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateOfferDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
