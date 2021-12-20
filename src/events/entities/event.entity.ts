import { Expose } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../auth/entities/user.entity";
import { PaginationResult } from "../../pagination/pagintaor";
import { Attendee } from "./attendee.entity";

@Entity()
export class Event {

  constructor(partial?: Partial<Event>)
  {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  
  @Column()
  @Expose()
  name: string;
  
  @Column()
  @Expose({name: 'description'})
  description: string;
  
  @Column()
  @Expose()
  time: Date;
  
  @Column()
  @Expose()
  address: string;
  
  @OneToMany(()=> Attendee, (attendee) => attendee.event, {cascade: true})
  @Expose()
  attendees: Attendee[];
  
  @ManyToOne(() => User, (user) => user.organized)
  @Expose()
  @JoinColumn({name:'organizerId'})
  organizer: User
}

export type PaginatedEvents = PaginationResult<Event>;
