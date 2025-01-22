import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

type ProductStatus = 'yeni' | 'foto_gerekli' | 'foto_yuklendi' | 'fiyat_gerekli' | 'fiyat_belirlendi' | 'seo_gerekli' | 'hazır';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  sku: string;

  @Column('float')
  weight: number;

  @Column('float')
  thickness: number;

  @Column('float')
  width: number;

  @Column('float')
  length: number;

  @Column({type: 'enum', enum: ['yeni', 'foto_gerekli', 'foto_yuklendi', 'fiyat_gerekli', 'fiyat_belirlendi', 'seo_gerekli', 'hazır'], default: 'yeni'})
  status: ProductStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
