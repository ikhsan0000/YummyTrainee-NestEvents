import { Event } from "./event.entity";

test('Event entity should be initialized by its constructor', () => {
  const event = new Event({
    name: 'this is test event',
    description: 'this is description'
  }); 

  expect(event).toEqual({
    name: 'this is test event',
    description: 'this is description',
    id: undefined,
    time: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    event: undefined,
    attendeeCount: undefined,
    attendeeRejected: undefined,
    attendeeMaybe: undefined,
    attendeeAccepted: undefined,
  })

})