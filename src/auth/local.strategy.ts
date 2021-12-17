import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy } from "passport-local";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
  
  private readonly logger = new Logger(LocalStrategy.name)

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>){
    super();
  }

  // automatically called when @UseGuard is used, and will returned to the next decorator as a request
  public async validate(username: string, password: string): Promise<any>{
    const user = await this.userRepository.findOne({ username: username });
    if (!user)
    {
      this.logger.debug(`user ${username} not found`)
      throw new UnauthorizedException;
    }
    
    if(!(await bcrypt.compare(password, user.password)))
    {
      this.logger.debug(`Credential for ${username} is invalid`)
      throw new UnauthorizedException;
    }

    return user;

  }
}