import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import { UpdateEventDto } from './dto/update-event.dto'
import { Attendee, AttendeeAnswerEnum } from './entities/attendee.entity';
import { ListEvents, WhenEventFilter } from './enum/list.events';
import { paginate, PaginateOptions, PaginationResult } from '../pagination/pagintaor';

@Injectable()
export class EventsService {

  private readonly logger = new Logger();

  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee) private readonly attendeeRepository: Repository<Attendee>
  ){}

  async findAll(filter?: ListEvents)
  {
    // return this.eventRepository.find({relations:['attendees']});
    let query = await this.getEventWithAttendeeCount();

    if(!filter)
    {
      return query
    }

    if(filter.when)
    {
      if(filter.when == WhenEventFilter.Today){
        query = query.andWhere(
          `e.time >= CURDATE() AND e.time <= CURDATE() + INTERVAL 1 DAY`
        );
      }
      if(filter.when == WhenEventFilter.Tommorow){
        query = query.andWhere(
          `e.time >= CURDATE() + INTERVAL 1 DAY AND e.time <= CURDATE() + INTERVAL 2 DAY`
        );
      }
      if(filter.when == WhenEventFilter.ThisWeek){
        query = query.andWhere(
          `YEARWEEK(e.time, 1) = YEARWEEK(CURDATE(), 1)`
        );
      }
      if(filter.when == WhenEventFilter.NextWeek){
        query = query.andWhere(
          `YEARWEEK(e.time, 1) = YEARWEEK(CURDATE(), 1) + 1`
        );
      }
      if(filter.when == WhenEventFilter.ThisYear){
        query = query.andWhere(
          `YEAR(e.time) = YEAR(CURDATE())`
        );
      }
      return query;
    }
    return query;
  }

  async findAllPaginated(filter: ListEvents,  paginateOptions: PaginateOptions)
  {
    return await paginate(await this.findAll(filter), paginateOptions);
  }

  async attendeeRelationTest() //not used
  {
    const event = await this.eventRepository.findOne({id : 1})
    const attendee = new Attendee();

    attendee.name = 'Terry';
    attendee.event = event;

    await this.attendeeRepository.save(attendee);
    return event;
  }

  findOne(id: number)
  {
    const event = this.eventRepository.findOne({id: id})
    if(!event)
    {
      throw new NotFoundException();
    }
    return event
  }


  async create(body: CreateEventDto)
  {
    const event = {
      ...body,
      time: new Date(body.time),
    }
    return this.eventRepository.save(event);
  }

  async update(id: number, body: UpdateEventDto)
  {
    const event = await this.eventRepository.findOne({id: id});

    if(!event)
    {
      throw new NotFoundException();
    }

    return await this.eventRepository.save({
      ...event,
      ...body,
      when: body.time ? new Date(body.time) : event.time
    })
  }

  async delete(id: number)
  {
    const event = await this.eventRepository.findOne({id: id})
    if(!event)
    {
      throw new NotFoundException();
    }
    return await this.eventRepository.remove(event)
  }

  async getEvent(id: number): Promise<Event>
  {
    const query  = (await this.getEventWithAttendeeCount())
    .andWhere('e.id = :id', { id });

    this.logger.debug(query.getSql());

    if(query.getOne() == undefined)
    {
      throw new NotFoundException();
    }
    return await query.getOne();
  }

  async getEventWithAttendeeCount()
  {
    return this.getEventBasedQuery()
    .loadRelationCountAndMap(
      'e.attendeeCount', 'e.attendees'
    )
    .loadRelationCountAndMap(
      'e.attendeeAccepted', 'e.attendees', 'attendee',
      (qb) => qb.where('attendee.answer = :answer',  {answer: AttendeeAnswerEnum.Accepted})
    )
    .loadRelationCountAndMap(
      'e.attendeeMaybe', 'e.attendees', 'attendee',
      (qb) => qb.where('attendee.answer = :answer',  {answer: AttendeeAnswerEnum.Maybe})
    )
    .loadRelationCountAndMap(
      'e.attendeeRejected', 'e.attendees', 'attendee',
      (qb) => qb.where('attendee.answer = :answer',  {answer: AttendeeAnswerEnum.Rejected})
    )
  }

  private getEventBasedQuery()
  {
    return this.eventRepository
    .createQueryBuilder('e')
    .orderBy('e.id', 'DESC');
  }

  async deleteEvent(id: number): Promise<DeleteResult>
  {
    return await this.eventRepository
    .createQueryBuilder('e')
    .delete()
    .where('id = :id', {id})
    .execute();
  }


}
