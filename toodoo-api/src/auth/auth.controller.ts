import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { UserIdDto } from './dto/profile-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @Public()
  @Post('login')
  async login(@Body() signInUserDto: SignInUserDto) {
    return await this.authService.signIn(signInUserDto);
  }

  @Get('profile/:id')
  async profile(@Param() userIdDto: UserIdDto) {
    return await this.authService.profile(userIdDto.id);
  }

  @Patch('update/:id')
  async update(
    @Param() userIdDto: UserIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.authService.update(userIdDto.id, updateUserDto);
  }

  @Delete('remove/:id')
  async remove(@Param() param: UserIdDto) {
    return await this.authService.remove(param.id);
  }
}
