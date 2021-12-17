import { IsEmail } from "class-validator";

export class CreateUserDto
{
  username:string;
  password:string;
  password_confirm:string;
  first_name: string;
  last_name: string;
  @IsEmail()
  email:string;
}