import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../auth/entities/user.entity";
import { Event } from "./entities/event.entity";
import { ListEvents } from "./enum/list.events";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;
  let eventsRepository: Repository<Event>;
  
  beforeAll(() => {console.log('only logged once')})
  
  beforeEach(() => {
    eventsService = new EventsService(eventsRepository);
    eventsController  = new EventsController(eventsService);
  });

  it('should return a list of events', async () => {
    const result = {
      first: 1,
      last: 1,
      limit: 10,
      total: 1,
      data: []
    }

    eventsService.findAllPaginated = jest.fn().mockImplementation((): any => result);
    
    const spy = jest.spyOn(eventsService, 'findAllPaginated')
    .mockImplementation((): any => result);

    expect(await eventsController.findAll(new ListEvents))
    .toEqual(result);

    expect(spy).toBeCalledTimes(1);
  })

  it('should not delete an event when event not found', async () => {
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');

    const findSpy = jest.spyOn(eventsService, 'findOne')
    .mockImplementation((): any => undefined);
    
    try{
      await eventsController.remove(40, new User());
    }
    catch(err){
      expect(err).toBeInstanceOf(NotFoundException);
    }

    expect(deleteSpy).toBeCalledTimes(0)
    expect(findSpy).toBeCalledTimes(1)

  }) 

})