import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../entities/base.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(1, 1024)
  @IsString()
  description: string;

  @Column()
  @IsUrl()
  @IsString()
  link: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsString()
  @IsOptional()
  image: string;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
