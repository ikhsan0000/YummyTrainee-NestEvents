import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {

  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>
  ){}

  findAll()
  {
    return this.eventRepository.find();
  }

  findOne(id: number)
  {
    return this.eventRepository.findOne({id: id})
  }

  create(body: CreateEventDto)
  {
    return this.eventRepository.save(body)
  }


}
