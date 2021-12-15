import { IsNotEmpty } from "class-validator";

export class CreateEventDto {

  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  time: string;
  @IsNotEmpty()
  address: string;
}
