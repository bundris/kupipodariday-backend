import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(user, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishesService.findMany({
      where: { id: In(createWishlistDto.itemsId) },
    });
    return await this.wishlistRepository.save({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
  }

  findAll() {
    return this.wishlistRepository.find({});
  }

  findOne(id: number) {
    return this.wishlistRepository.findOne({ where: { id } });
  }

  async updateOne(
    userId: number,
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wishlist) {
      throw new NotFoundException('Нет такого вишлиста');
    }
    if (userId !== wishlist.owner.id) {
      throw new BadRequestException('Это чужой вишлист, не трогайте');
    }
    const { name, image, itemsId, description } = updateWishlistDto;
    const wishes = await this.wishesService.findMany({
      where: { id: In(itemsId) },
    });
    wishlist.name = name;
    wishlist.image = image;
    wishlist.description = description;
    wishlist.items = wishes;
    return await this.wishlistRepository.save(wishlist);
  }

  async removeOne(id: number) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Нет такого вишлиста');
    }
    return await this.wishlistRepository.delete(id);
  }
}
