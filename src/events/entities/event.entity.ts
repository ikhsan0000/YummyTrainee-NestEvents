import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
