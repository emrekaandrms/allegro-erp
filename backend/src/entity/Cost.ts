import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';

@Entity()
export class Cost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  gold_price_per_gram: number;

  @Column('float')
  labor_cost: number;

  @Column('float')
  shipping_cost: number;

  @Column('float')
  shopify_commission: number;

  @Column('float')
  etsy_commission: number;

  @Column('float')
  amazon_commission: number;

  @Column('float')
  hepsiburada_commission: number;

  @Column('float')
  trendyol_commission: number;

  @Column('float')
  payment_commission: number;

  @Column('float')
  shopify_final_price: number;

  @Column('float')
  etsy_final_price: number;

  @Column('float')
  amazon_final_price: number;

  @Column('float')
  hepsiburada_final_price: number;

  @Column('float')
  trendyol_final_price: number;

  @ManyToOne(() => Product, product => product.costs)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
