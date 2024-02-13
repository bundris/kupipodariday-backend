import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { UpdateWishDto } from '../wishes/dto/update-wish.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly userService: UsersService,
    private readonly wishService: WishesService,
    private dataSource: DataSource,
  ) {}

  async create(username: string, createOfferDto: CreateOfferDto) {
    const { hidden, amount, itemId } = createOfferDto;
    const user = await this.userService.findByUsername(username);
    const wish = await this.wishService.findById(itemId);
    if (wish.owner.username === username) {
      throw new ConflictException('Нельзя оплачивать свои подарки');
    }
    const upd: UpdateWishDto = { raised: wish.raised + amount };
    if (upd.raised > wish.price) {
      throw new BadRequestException('Не переплачивай!');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.wishService.updateOne({ where: { id: wish.id } }, { ...upd });
      const result = await this.offerRepository.save({
        hidden,
        amount,
        user: user,
        item: wish,
      });
      await queryRunner.commitTransaction();
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        'Не удалось скинуться на подарок, попробуйте позже',
      );
    }
  }

  async findOne(query: FindOneOptions<Offer>) {
    return await this.offerRepository.findOne(query);
  }

  async findById(id) {
    return await this.findOne({
      where: { id },
      relations: {
        user: true,
        item: true,
      },
    });
  }

  async findByUser(username: string) {
    return await this.userService.findOffers(username);
  }

  async updateOne(
    query: FindOneOptions<Offer>,
    updateOfferDto: UpdateOfferDto,
  ) {
    const offer = await this.findOne(query);
    return await this.offerRepository.update(
      { id: offer.id },
      { ...updateOfferDto },
    );
  }

  async removeOne(query) {
    const offer = await this.findOne(query);
    return this.offerRepository.delete({ id: offer.id });
  }
}
