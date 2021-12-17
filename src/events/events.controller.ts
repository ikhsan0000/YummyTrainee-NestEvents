import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { ListEvents } from './enum/list.events';
import { EventsService } from './events.service';


@Controller('events')
export class EventsController {

  private readonly logger = new Logger(EventsController.name)

  constructor(
    private readonly eventsService: EventsService
  ){}

  @Get()
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

  @Get('relation')
  async relationTest(){
    return this.eventsService.attendeeRelationTest();
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id){
    // return this.eventsService.findOne(id);
    const result = this.eventsService.getEvent(id)
    return result;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: CreateEventDto, @CurrentUser() user: User){
    return this.eventsService.create(body, user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id, 
    @Body() body: CreateEventDto,
    @CurrentUser() user: User){
    return this.eventsService.update(id, body, user)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id, @CurrentUser() user: User){
    // return this.eventsService.delete(id)
    const result = await this.eventsService.deleteEvent(id, user)

    if(result.affected !== 1)     //using query builder
    {
      throw new NotFoundException();
    }
  }
}
