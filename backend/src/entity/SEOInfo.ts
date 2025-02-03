import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';

@Entity()
export class SEOInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['shopify', 'etsy', 'amazon', 'hepsiburada', 'trendyol']
  })
  platform: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  meta_title: string;

  @Column('text')
  meta_description: string;

  @ManyToOne(() => Product, product => product.seo_infos)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
