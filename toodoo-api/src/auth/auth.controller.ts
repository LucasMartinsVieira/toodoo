import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { AuthGuard } from './auth.guard';
import { ProfileUserDto } from './dto/profile-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() signInUserDto: SignInUserDto) {
    return await this.authService.signIn(signInUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile/:id')
  async profile(@Param() params: ProfileUserDto) {
    return await this.authService.profile(params.id);
  }
}
