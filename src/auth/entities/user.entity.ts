import { IsEmail } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "../../events/entities/event.entity";
import { Profile } from "./profile.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id:number;

  @Column({ unique: true })
  username:string;

  @Column()
  password:string;

  @Column({ unique: true })
  email:string;

  @Column()
  first_name:string;

  @Column()
  last_name:string;

  @OneToOne(() => Profile)
  @JoinColumn({name: 'profile_id'})
  profile: Profile

  @OneToMany(() => Event, (event) => event.organizer)
  organized: Event[];
}
