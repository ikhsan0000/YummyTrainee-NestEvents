import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';


@Controller('events')
export class EventsController {

  constructor(
    private readonly eventsService: EventsService
  ){}

  @Get()
  findAll(){
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id){
    return this.eventsService.findOne(id) ;
  }

  @Post()
  create(@Body() body: CreateEventDto){
    return this.eventsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: CreateEventDto){
    return body;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param() id: string){
    return `you are deleteing ${id}`
  }
}
