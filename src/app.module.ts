import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/reports.entity';
import cookieSession from 'cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true
        }
      }
    }),

    // TypeOrmModule.forRoot({
    //   type: 'sqlite', //type of db
    //   database: 'db.sqlite', //db name
    //   entities: [User, Report], //entities of the db
    //   synchronize: true //for migration only for dev not for prod 
    // }),
    UsersModule,
    ReportsModule

  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, //remove extra properties autometicaly in requests 
      }),
    }
  ],
})
export class AppModule {

  constructor(private configService:ConfigService){}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        keys: [this.configService.get('COOKIE_KEY')!],
      }),
    ).forRoutes('*')
  }
}
