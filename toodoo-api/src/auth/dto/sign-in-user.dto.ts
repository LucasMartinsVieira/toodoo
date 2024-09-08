import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(128)
  @ApiProperty({
    title: 'The email of the user',
    description: `User's email that will be used to register/login`,
    example: 'john.doe@email.com',
    maxLength: 128,
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  @ApiProperty({
    title: 'The password of the user',
    description: `User's password that will be used to register/login`,
    minLength: 3,
    maxLength: 128,
    required: true,
  })
  password: string;
}
