import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Product } from '../entity/Product';
import { Photo } from '../entity/Photo';
import { Cost } from '../entity/Cost';
import { SEOInfo } from '../entity/SEOInfo';
import { SystemParam } from '../entity/SystemParam';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Product, Photo, Cost, SEOInfo, SystemParam],
  synchronize: false,
  migrations: ["src/migration/*.ts"],
  logging: false
});
