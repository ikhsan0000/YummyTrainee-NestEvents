import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity"

export class JwtStrategy extends PassportStrategy(Strategy)
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  )
  { super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: process.env.JWT_SECRET_KEY
    });
  }

  // automatically called when @UseGuard is used, and will returned to the next decorator as a request
  async validate(payload: any)
  {
    console.log(payload.username)   //directly calling the payload from signed jwt token (testing purpose)
    return await this.userRepository.findOne(payload.sub);    //using the id in the payload to return the entire user from database

  }


}