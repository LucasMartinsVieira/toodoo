import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

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
  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
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

  async profile(id: string) {
    const user = await this.usersService.findOne(id);

    if (user) {
      // Deleting sensitive information for user profile
      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;
      delete user.id;

      return user;
    }

    throw new UnauthorizedException();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.usersService.remove(id);
  }
}
