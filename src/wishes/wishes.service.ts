import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}
  async create(username, createWishDto: CreateWishDto) {
    const user = await this.usersService.findByUsername(username);
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    });
  }

  async findOne(query: FindOneOptions<Wish>) {
    return await this.wishesRepository.findOne(query);
  }
  async findMany(query: FindManyOptions<Wish>) {
    return await this.wishesRepository.find(query);
  }

  async findById(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
    if (!wish) {
      throw new ConflictException('Подарок не найден');
    }
    return wish;
  }

  async updateOne(query: FindOneOptions<Wish>, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(query);
    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    return await this.wishesRepository.update({ id: wish.id }, updateWishDto);
  }

  async removeOne(userId: number, query: FindOneOptions<Wish>) {
    const wish = await this.findOne(query);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалять чужие подарки!');
    }
    return await this.wishesRepository.delete({ id: wish.id });
  }

  async copyWish(username, wishId) {
    const wish = await this.findOne({ where: { id: wishId } });
    const newOwner = await this.usersService.findByUsername(username);

    if (wish.owner.id === newOwner.id) {
      throw new ForbiddenException('Вы уже копировали этот подарок!');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.wishesRepository.update(
        { id: wish.id },
        { copied: wish.copied + 1 },
      );
      await this.wishesRepository.insert({
        ...wish,
        owner: newOwner,
        offers: [],
        copied: 0,
        raised: 0,
      });
      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return false;
    }
  }
}
