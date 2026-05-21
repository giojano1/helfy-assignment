import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Category } from './Category';
import { ProductImage } from './ProductImage';
import { Tag } from './Tag';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ unique: true, length: 255 })
  slug!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ name: 'compare_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  comparePrice!: number | null;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ name: 'category_id' })
  categoryId!: string;

  @ManyToOne(() => Category, (category) => category.products, { eager: false })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images!: ProductImage[];

  @ManyToMany(() => Tag, (tag) => tag.products, { cascade: true })
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'product_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags!: Tag[];

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating!: number;

  @Column({ name: 'review_count', type: 'int', default: 0 })
  reviewCount!: number;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}
