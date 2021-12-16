import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateEventDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
  
  @IsDateString()
  @IsNotEmpty()
  time: string;
  
  @IsNotEmpty()
  address: string;
}
