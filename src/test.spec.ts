import { Event } from "./events/entities/event.entity";

test('test is null', () => {
  const x = null;

  expect(x).toBeNull();
})

test('3+4', ()=> {
  const result = 3+4;
  expect(result).toBe(7);
})
