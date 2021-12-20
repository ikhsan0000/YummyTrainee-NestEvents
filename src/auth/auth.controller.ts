import { ClassSerializerInterceptor, Controller, Get, Post, Request, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@SerializeOptions({strategy: 'excludeAll'})
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ){}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@CurrentUser() user) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user)
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@CurrentUser() user){
    return user
  }
}
