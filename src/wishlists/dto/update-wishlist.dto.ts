import { CreateWishlistDto } from './create-wishlist.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {}
