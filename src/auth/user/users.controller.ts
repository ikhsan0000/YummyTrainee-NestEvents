import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {

  constructor(
    private readonly usersService: UsersService
  )
  {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto)
  {
    return await this.usersService.create(createUserDto)
  }
}
