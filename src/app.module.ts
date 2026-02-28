import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/reports.entity';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite', //type of db
    database: 'db.sqlite', //db name
    entities: [User, Report], //entities of the db
    synchronize: true //for migration only for dev not for prod 
  }), UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
