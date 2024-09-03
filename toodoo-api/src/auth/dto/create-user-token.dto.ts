import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserTokenDto {
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
