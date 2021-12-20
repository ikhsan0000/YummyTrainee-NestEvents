import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller.controller'
import { AttendeesService } from './attendees.service';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventsAttendeeController } from './event-attendee.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Attendee])
  ],
  controllers: [
    EventsController,
    EventsOrganizedByUserController,
    CurrentUserEventAttendanceController,
    EventsAttendeeController
  ],
  providers: [EventsService, AttendeesService],
  exports: [EventsService, AttendeesService]
})
export class EventsModule {}

