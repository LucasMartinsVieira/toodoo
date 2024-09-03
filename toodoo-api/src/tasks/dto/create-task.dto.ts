import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../tasks-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(1)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(800)
  @MinLength(1)
  description?: string;

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
