import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ){}

  getTokenForUser(user: User): string
  {
    return this.jwtService.sign({ 
      username: user.username, 
      sub: user.id                //sign the current user id to the token as a hash
    });
  }

  async hashPassword(password: string): Promise<string>
  {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword;
  }
}
