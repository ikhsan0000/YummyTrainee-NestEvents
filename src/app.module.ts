import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({      //forRootAsync is used instead of forRoot so imported module orders wont matter because we need to access env first
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 2021,
        username: 'root',
        password: '',
        database: 'nest_events',
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
