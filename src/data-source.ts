import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity.ts'],
  migrations: [__dirname + '/db/migrations/*.ts'],
} as DataSourceOptions);
