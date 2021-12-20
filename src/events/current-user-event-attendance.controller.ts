import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Put, Query, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../auth/entities/user.entity";
import { AttendeesService } from "./attendees.service";
import { CreateAttendeeDto } from "./dto/create-attendee.dto";
import { EventsService } from "./events.service";

@Controller('events-attendance')
@SerializeOptions({strategy: 'excludeAll'})
export class CurrentUserEventAttendanceController
{
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeesService: AttendeesService
    ) {}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard('jwt'))
    async findAll(
      @CurrentUser() user: User,
      @Query('page', ParseIntPipe, new DefaultValuePipe(1)) page
    )
    {
      return await this.eventsService
      .getEventsAttendedByUserIdPaginated(user.id, { limit: 3, currentPage: page})
    } 

    @Get(':eventId')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard('jwt'))
    async findOne(
      @Param('eventId', ParseIntPipe) eventId: number,
      @CurrentUser() user: User
    )
    {
      const attendee = await this.attendeesService.findOneByEventIdAndUserId(eventId, user.id);

      if(!attendee)
      {
        throw new NotFoundException();
      }

      return attendee;
    } 

    @Put('/:eventId')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard('jwt'))
    async createOrUpdate(
      @Param('eventId', ParseIntPipe) eventId: number,
      @Body() input: CreateAttendeeDto,
      @CurrentUser() user: User
    )
    {
      return this.attendeesService.createOrUpdate(input, eventId, user.id);
    }

}