import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './config/orm.config';
import { EventsModule } from './events/events.module';
import { SchoolModule } from './school/school.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load:[ormConfig]
    }),
    TypeOrmModule.forRootAsync({      //forRootAsync is used instead of forRoot so imported module orders wont matter because we need to access env first
      useFactory: ormConfig
    }),
    EventsModule,
    SchoolModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
