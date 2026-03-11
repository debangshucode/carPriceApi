import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbType = this.configService.get<string>('DB_TYPE');

    if (dbType === 'sqlite') {
      return {
        type: 'sqlite',
        database: this.configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      };
    }

    if (dbType === 'postgres') {
      return {
        type: 'postgres',
        host: this.configService.get<string>('DB_HOST'),
        port: this.configService.get<number>('DB_PORT'),
        username: this.configService.get<string>('DB_USERNAME'),
        password: this.configService.get<string>('DB_PASSWORD'),
        database: this.configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun:true,
        ssl:{
            rejectUnauthorized:false,
        }
      };
    }

    throw new Error('Unsupported DB_TYPE');
  }
}
