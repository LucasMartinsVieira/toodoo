import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { CreateUserTokenDto } from './dto/create-user-token.dto';

@Injectable()
export class AuthService {
  private readonly issuer = 'signin';
  private readonly audience = 'users';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(signInUserDto: SignInUserDto) {
    const { email, password } = signInUserDto;
    const user = await this.usersService.validateUser(email, password);

    if (user) {
      return user;
    }

    throw new UnauthorizedException('Email and/or password is incorrect!');
  }

  async createToken(createUserTokenDto: CreateUserTokenDto) {
    const payload = {
      email: createUserTokenDto.email,
      name: createUserTokenDto.name,
      id: createUserTokenDto.id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '7 days',
        subject: String(createUserTokenDto.id),
        issuer: this.issuer,
        audience: this.audience,
      }),
    };
  }

  async signIn(signInUserDto: SignInUserDto) {
    const user = await this.validateUser(signInUserDto);

    if (user) {
      return await this.createToken(user);
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.create(registerUserDto);

    if (user) {
      return await this.createToken(user);
    }
  }
}
