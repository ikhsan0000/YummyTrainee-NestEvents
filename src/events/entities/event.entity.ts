import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../auth/entities/user.entity";
import { Attendee } from "./attendee.entity";

@Entity()
export class Event {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  description: string;
  
  @Column()
  time: Date;
  
  @Column()
  address: string;

  @OneToMany(()=> Attendee, (attendee) => attendee.event, {cascade: true})
  attendees: string[];

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({name:'organizerId'})
  organizer: User
}
