import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    if (user) {
      throw new ConflictException('Пользователь уже существует');
    }
    const hashedDto = await this.hashService.hashDtoPassword(createUserDto);
    return await this.usersRepository.save({
      ...hashedDto,
      offers: [],
      wishes: [],
      wishlists: [],
    });
  }

  findOne(query: FindOneOptions<User>) {
    try {
      return this.usersRepository.findOne(query);
    } catch (e) {
      throw new ConflictException(
        'Не удалось извлечь данные о пользователе из БД',
      );
    }
  }

  findMany(query: FindManyOptions<User>) {
    try {
      return this.usersRepository.find(query);
    } catch (e) {
      throw new ConflictException(
        'Не удалось извлечь данные о пользователях из БД',
      );
    }
  }

  async findByUsername(username: string, withPassword = false) {
    const user = await this.findOne({
      where: { username },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        email: true,
        about: true,
        avatar: true,
        password: withPassword,
      },
    });
    if (!user) {
      throw new NotFoundException('Нет пользователя с указанным логином');
    }
    return user;
  }

  async findWishes(username: string) {
    const user = await this.findOne({
      where: { username },
      relations: { wishes: true },
    });
    if (!user) {
      throw new NotFoundException('Нет запрашиваемого пользователя');
    }
    return user.wishes;
  }

  async findOffers(username: string) {
    const user = await this.findOne({
      where: { username },
      relations: { offers: true },
    });
    if (!user) {
      throw new NotFoundException('Нет запрашиваемого пользователя');
    }
    return user.offers;
  }

  async HasUsernameOrEmail(updateUserDto: UpdateUserDto) {
    const q = [];
    if (updateUserDto.username) {
      q.push({ username: updateUserDto.username });
    }
    if (updateUserDto.email) {
      q.push({ email: updateUserDto.email });
    }
    if (q.length === 0) {
      return false;
    }
    const usersToCheck = await this.findMany({ where: q });
    return usersToCheck.length > 0;
  }

  async updateOne(query: FindOneOptions<User>, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(query);
    if (!user) {
      throw new NotFoundException('Нет пользователя, которого хотим обновить');
    }
    const hasUsers = await this.HasUsernameOrEmail(updateUserDto);
    if (hasUsers) {
      throw new ForbiddenException(
        'Пользователь с таким email или username уже существует в системе',
      );
    }
    const hashedDto = await this.hashService.hashDtoPassword(updateUserDto);
    return await this.usersRepository.update({ id: user.id }, hashedDto);
  }

  async updateUser(username: string, updateUserDto: UpdateUserDto) {
    return this.updateOne({ where: { username } }, updateUserDto);
  }
}
