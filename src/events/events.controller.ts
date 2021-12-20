import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { ListEvents } from './enum/list.events';
import { EventsService } from './events.service';


@Controller('events')
@SerializeOptions({strategy: 'excludeAll'})
export class EventsController {

  private readonly logger = new Logger(EventsController.name)

  constructor(
    private readonly eventsService: EventsService
  ){}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents){
    // const call = await this.eventsService.findAll(filter);
    const call = await this.eventsService.findAllPaginated(
      filter,
      {
        total: true,
        currentPage: filter.page,
        limit: 3
      }
    );
    return call;
  }


  // this endpoint is for testing purposes
  // @Get('relation')
  // async relationTest(){
  //   return this.eventsService.attendeeRelationTest();
  // }
  
  @Get(':id')
  // @UseInterceptors(ClassSerializerInterceptor)  //expose the properties from the entity class
  findOne(@Param('id', ParseIntPipe) id){
    // return this.eventsService.findOne(id);
    const result = this.eventsService.getEvent(id)
    return result;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() body: CreateEventDto, @CurrentUser() user: User){
    const result = await this.eventsService.create(body, user);
    // return plainToClass(Event, result)
    return result;
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id, 
    @Body() body: UpdateEventDto,
    @CurrentUser() user: User){
    return this.eventsService.update(id, body, user)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id, @CurrentUser() user: User){
    // return this.eventsService.delete(id)
    const result = await this.eventsService.deleteEvent(id, user)
  }
}
