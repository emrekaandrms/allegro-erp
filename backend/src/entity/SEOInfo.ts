import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Product } from './Product';

type Platforms = 'shopify' | 'etsy' | 'trendyol' | 'amazon' | 'hepsiburada';

@Entity()
export class SEOInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ type: 'enum', enum: ['shopify','etsy','trendyol','amazon','hepsiburada'] })
  platform: Platforms;

  @Column()
  title: string;

  @Column({nullable: true})
  description: string;

  @Column({nullable: true})
  meta_title: string;

  @Column({nullable: true})
  meta_description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
