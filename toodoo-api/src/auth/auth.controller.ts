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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'Successfully registered. Returns an access token.',
    schema: {
      example: {
        access_token: 'the genereted jwt token here',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Failed to register user. Returns an class-validator error.',
    schema: {
      example: {
        error: 'Bad Request',
        message: [
          'name must be shorter than or equal to 63 characters',
          'name should not be empty',
          'name must be a string',
          'password must be shorter than or equal to 128 characters',
          'password must be longer than or equal to 3 characters',
          'password should not be empty',
          'password must be a string',
          'email must be shorter than or equal to 128 characters',
          'email should not be empty',
          'email must be an email',
        ],
        statusCode: 400,
      },
    },
  })
  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @ApiCreatedResponse({
    description: 'Successfully log in. Returns an access token.',
    schema: {
      example: {
        access_token: 'the genereted jwt token here',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Failed to log in user. Returns an class-validator error.',
    schema: {
      example: {
        error: 'Bad Request',
        message: [
          'password must be shorter than or equal to 128 characters',
          'password must be longer than or equal to 3 characters',
          'password should not be empty',
          'password must be a string',
          'email must be shorter than or equal to 128 characters',
          'email should not be empty',
          'email must be an email',
        ],
        statusCode: 400,
      },
    },
  })
  @Public()
  @Post('login')
  async login(@Body() signInUserDto: SignInUserDto) {
    return await this.authService.signIn(signInUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully retrieve user information.',
    schema: {
      example: {
        email: 'user email here',
        id: 'id here',
        name: 'user name here',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Failed to retrieve user by id',
    schema: {
      example: {
        error: 'Not Found',
        message: 'The user ID does not exist!',
        statusCode: 404,
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('profile/:id')
  async profile(@Param() userIdDto: UserIdDto) {
    return await this.authService.profile(userIdDto.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully updated user. Returns true.',
  })
  @ApiNotFoundResponse({
    description: 'Failed to retrieve user by id',
    schema: {
      example: {
        error: 'Not Found',
        message: 'The user ID does not exist!',
        statusCode: 404,
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @Patch('update/:id')
  async update(
    @Param() userIdDto: UserIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.authService.update(userIdDto.id, updateUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully deleted user. Returns true',
  })
  @ApiNotFoundResponse({
    description: 'Failed to delete user by id',
    schema: {
      example: {
        error: 'Not Found',
        message: 'The user ID does not exist!',
        statusCode: 404,
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @Delete('remove/:id')
  async remove(@Param() param: UserIdDto) {
    return await this.authService.remove(param.id);
  }
}
