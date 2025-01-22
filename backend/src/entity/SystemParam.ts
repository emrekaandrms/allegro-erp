import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SystemParam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  param_key: string;

  @Column()
  param_value: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
