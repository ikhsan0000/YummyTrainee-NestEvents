import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAttendeeDto } from "./dto/create-attendee.dto";
import { Attendee } from "./entities/attendee.entity";

@Injectable()
export class AttendeesService{

  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>
  ){}

  async findByEventId(eventId: number): Promise<Attendee[]>
  {
    return await this.attendeeRepository.find({
      event: { id: eventId }
    })
  }

  async findOneByEventIdAndUserId(
    eventId:number, userId:number
  ): Promise<Attendee | undefined>
  {
    return await this.attendeeRepository.findOne(
      { 
        event: {id: eventId},
        user: {id: userId}
      }
    )
  }

  async createOrUpdate(
    input: CreateAttendeeDto, eventId: number, userId: number
  ): Promise<Attendee>
  {
     const attendee = await this.findOneByEventIdAndUserId(eventId, userId)
     ?? new Attendee();

     attendee.eventId = eventId;
     attendee.userId = userId;
     attendee.answer = input.answer;

     return await this.attendeeRepository.save(attendee);
  }

}