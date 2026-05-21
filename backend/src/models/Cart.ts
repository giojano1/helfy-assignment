import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { CartItem } from './CartItem';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', nullable: true, type: 'varchar' })
  userId!: string | null;

  @ManyToOne(() => User, (user) => user.carts, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;

  @Column({ name: 'session_id', length: 128, nullable: true, type: 'varchar' })
  sessionId!: string | null;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items!: CartItem[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
