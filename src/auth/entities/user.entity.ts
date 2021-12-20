import { Expose } from "class-transformer";
import { IsEmail } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "../../events/entities/attendee.entity";
import { Event } from "../../events/entities/event.entity";
import { Profile } from "./profile.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  @Expose()
  id:number;
  
  @Column({ unique: true })
  @Expose()
  username:string;
  
  @Column()
  password:string;
  
  @Column({ unique: true })
  @Expose()
  email:string;
  
  @Column()
  @Expose()
  first_name:string;
  
  @Column()
  @Expose()
  last_name:string;
  
  @OneToOne(() => Profile)
  @JoinColumn({name: 'profile_id'})
  @Expose()
  profile: Profile
  
  @OneToMany(() => Event, (event) => event.organizer)
  @Expose()
  organized: Event[];

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  attended: Attendee[];
}
