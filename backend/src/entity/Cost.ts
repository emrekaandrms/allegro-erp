import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Product } from './Product';

@Entity()
export class Cost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column('float', {nullable: true})
  gold_price_per_gram: number;

  @Column('float', {nullable: true})
  shipping_cost: number;

  @Column('float', {nullable: true})
  advertising_cost: number;

  @Column('float', {nullable: true})
  calculated_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
