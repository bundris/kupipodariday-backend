import { Entity, Column, OneToMany } from 'typeorm';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { BaseEntity } from '../../entities/base.entity';

// Свяжите таблицу пользователей с таблицей рейтинга.
// Для этого добавьте соответствующее поле в описание модели и задайте связь при помощи декоратора

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @Length(2, 30)
  @IsString()
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  @IsString()
  @IsOptional()
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsString()
  @IsOptional()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  @IsString()
  email: string;

  @Column({ select: false })
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
