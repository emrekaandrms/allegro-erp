import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type UserRole = 'operasyon' | 'fotoğraf' | 'muhasebe' | 'seo' | 'admin';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  email: string;

  @Column()
  password_hash: string;

  @Column({type: 'enum', enum: ['operasyon', 'fotoğraf', 'muhasebe', 'seo', 'admin'], default: 'operasyon'})
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
