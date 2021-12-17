import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { AuthService } from "../auth.service";


@Injectable()
export class UsersService{

  constructor(
    @InjectRepository(User) private readonly userService: Repository<User>,
    private readonly authService: AuthService,
    )
  {}

  async create(createUserDto: CreateUserDto)
  {
    if(createUserDto.password !== createUserDto.password_confirm)
    {
      throw new BadRequestException('Password does not match');
    }
    const existingUser = await this.userService.findOne({
      where:[
        {username: createUserDto.username},
        {email: createUserDto.email},
      ]
    })
    
    if(existingUser)
    {
      throw new BadRequestException('username or email already exist')
    }

    let user = new User();
    const {password, password_confirm, ...rest} = createUserDto;
    const passwordHashed = await bcrypt.hash(password, 10);
    user.username = createUserDto.username
    user.first_name = createUserDto.first_name
    user.last_name = createUserDto.last_name
    user.password = passwordHashed
    user.email = createUserDto.email
    this.userService.create(user);
    await this.userService.save(user);
    return {
      ...rest,
      token:this.authService.getTokenForUser(user)
    }

  }

}