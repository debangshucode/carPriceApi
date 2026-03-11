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
import { TypeOrmConfigService } from './config/typeorm.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    TypeOrmModule.forRootAsync({
      useClass:TypeOrmConfigService,
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
