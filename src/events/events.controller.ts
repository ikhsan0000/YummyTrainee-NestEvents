import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
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
  create(@Body() body: CreateEventDto){
    return this.eventsService.create(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id, @Body() body: CreateEventDto){
    return this.eventsService.update(id, body)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id){
    // return this.eventsService.delete(id)

    const result = await this.eventsService.deleteEvent(id)

    if(result.affected !== 1)
    {
      throw new NotFoundException();
    }

    
  }
}
