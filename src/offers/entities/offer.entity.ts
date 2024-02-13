import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsBoolean, IsNumber, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntity } from '../../entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Offer extends BaseEntity {
  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @JoinColumn()
  item: Wish;
}
