import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  username:string;

  @Column()
  password:string;

  @Column()
  email:string;

  @Column()
  first_name:string;

  @Column()
  last_name:string;

  @OneToOne(() => Profile)
  profile: Profile
}
