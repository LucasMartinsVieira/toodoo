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
import { ApiProperty } from '@nestjs/swagger';
/**
 * DTO for creating a new task.
 */
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(1)
  @ApiProperty({
    description: 'The title of the task',
    example: 'Buy groceries',
    minLength: 1,
    maxLength: 64,
    required: true,
  })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(800)
  @MinLength(1)
  @ApiProperty({
    description: 'The description of the task',
    example: "Buy groceries at nearby store at 11 O'clock",
    minLength: 1,
    maxLength: 800,
    required: false,
  })
  description?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'The due date of the task',
    example: new Date(),
    required: false,
    type: Date,
  })
  dueDate?: Date;

  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiProperty({
    description: 'The status of the task',
    example: TaskStatus.PENDING,
    enum: TaskStatus,
    required: false,
    default: TaskStatus.PENDING,
  })
  status?: TaskStatus;
}
