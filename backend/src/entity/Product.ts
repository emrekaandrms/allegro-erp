import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Cost } from './Cost';
import { SEOInfo } from './SEOInfo';

type ProductStatus = 'yeni' | 'foto_gerekli' | 'foto_yuklendi' | 'fiyat_gerekli' | 'fiyat_belirlendi' | 'seo_gerekli' | 'hazır';

export enum ProductKarat {
  K10 = "10K",
  K14 = "14K",
  K18 = "18K"
}

export enum ProductType {
  RING = "Yüzük",
  NECKLACE = "Kolye",
  EARRING = "Küpe",
  BRACELET = "Bileklik",
  CHAIN = "Zincir",
  PENDANT = "Kolye Ucu"
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  sku: string;

  @Column({ default: 14 }) // Varsayılan olarak 14K
  karat: number;

  @Column({
    type: "enum",
    enum: ProductType,
    nullable: false
  })
  type: ProductType;

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

  @OneToMany(() => Cost, cost => cost.product)
  costs: Cost[];

  @OneToMany(() => SEOInfo, seoInfo => seoInfo.product)
  seo_infos: SEOInfo[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
