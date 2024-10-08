import { IsNotEmpty, IsString } from 'class-validator';

export class UserIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
