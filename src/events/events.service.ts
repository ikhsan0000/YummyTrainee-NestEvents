import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, PaginatedEvents } from './entities/event.entity';
import { UpdateEventDto } from './dto/update-event.dto'
import { Attendee, AttendeeAnswerEnum } from './entities/attendee.entity';
import { ListEvents, WhenEventFilter } from './enum/list.events';
import { paginate, PaginateOptions, PaginationResult } from '../pagination/pagintaor';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class EventsService {

  private readonly logger = new Logger();

  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
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

  async findAllPaginated(filter: ListEvents,  paginateOptions: PaginateOptions): Promise<PaginatedEvents>
  {
    return await paginate(await this.findAll(filter), paginateOptions);
  }

  // async attendeeRelationTest() //not used
  // {
  //   const event = await this.eventRepository.findOne({id : 1})
  //   const attendee = new Attendee();

  //   attendee.name = 'Terry';
  //   attendee.event = event;

  //   await this.attendeeRepository.save(attendee);
  //   return event;
  // }

  findOne(id: number)
  {
    const event = this.eventRepository.findOne({id: id})
    if(!event)
    {
      throw new NotFoundException();
    }
    return event
  }

  async create(createEventDto: CreateEventDto, user: User): Promise<Event>
  {
    //This returns plain json, which serializer cannot serialize
    // return await this.eventRepository.save({
    //   ...createEventDto,
    //   organizer: user,
    //   time: new Date(createEventDto.time)
    // })


    return await this.eventRepository.save(
      new Event({
        ...createEventDto,
        organizer: user,
        time: new Date(createEventDto.time)
      })
    )

  }


  async update(id: number, body: UpdateEventDto, user: User)
  {
    const event = await this.eventRepository.findOne({id: id});

    if(!event)
    {
      throw new NotFoundException();
    }

    if(event.organizer.id !== user.id)
    {
      throw new ForbiddenException(null, 'you are not authorized to modify this event');
    }

    return await this.eventRepository.save(new Event({
      ...event,
      ...body,
      time: body.time ? new Date(body.time) : event.time
      })
    )
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
    .loadAllRelationIds()
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

  private getEventBasedQuery(): SelectQueryBuilder<Event>
  {
    return this.eventRepository
    .createQueryBuilder('e')
    .orderBy('e.id', 'DESC');
  }

  async getEventsOrganizedByUserIdPaginated(userId: number, paginateOptions: PaginateOptions): Promise<PaginatedEvents>
  {
    return await paginate<Event>(
      this.getEventsOrganizedByUserIdQuery(userId), 
      paginateOptions
    )
  }

  private getEventsOrganizedByUserIdQuery(userId: number): SelectQueryBuilder<Event>
  {
    return this.getEventBasedQuery().where('e.organizerId = :userId', { userId })
  }


  async getEventsAttendedByUserIdPaginated(userId: number, paginateOptions: PaginateOptions): Promise<PaginatedEvents>
  {
    return await paginate<Event>(
      this.getEventsAttendedByUserIdQuery(userId), 
      paginateOptions
    )
  }

  private getEventsAttendedByUserIdQuery(userId: number): SelectQueryBuilder<Event>
  {
    return this.getEventBasedQuery()
    .leftJoinAndSelect('e.attendees', 'a')
    .where('a.userId = :userId', {userId})
  }


  async deleteEvent(id: number, user: User)
  {
    const event = await this.eventRepository.findOne({id: id}, {relations: ['organizer']})
    console.log(id)
    if(!event)
    {
      throw new NotFoundException();
    }
    else if(event.organizer.id !== user.id)
    {
      throw new ForbiddenException('you are not authorized to remove this event');
    }
    else
    {
      return await this.eventRepository.delete({id: id})
    }
  }


}
