import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { UserController } from './user/users.controller';
import { UsersService } from './user/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    JwtModule.registerAsync({ 
      useFactory: () => (
        {secret: process.env.JWT_SECRET_KEY, 
          signOptions: 
          {
            expiresIn: '1d'
          }
        })
    })
  ],
  controllers: [AuthController, UserController],
  providers: [LocalStrategy, AuthService, JwtStrategy, UsersService]
})
export class AuthModule {}
