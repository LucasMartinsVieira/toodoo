import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
