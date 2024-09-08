import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiResponse({
    status: 200,
    description: 'Successfully created task.',
    schema: {
      example: {
        createdAt: 'task createdAt here',
        description: 'task description here',
        dueDate: 'task dueDate here',
        id: 'task id here',
        status: 'pending | in-progress | completed',
        title: 'task title here',
        updatedAt: 'task updatedAt here',
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const userId = req.user.id;

    return await this.tasksService.create(createTaskDto, userId);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all tasks',
    schema: {
      example: {
        createdAt: 'task createdAt here',
        description: 'task description here',
        dueDate: 'task dueDate here',
        id: 'task id here',
        status: 'pending | in-progress | completed',
        title: 'task title here',
        updatedAt: 'task updatedAt here',
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;

    return await this.tasksService.findAll(userId);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved task by id.',
    schema: {
      example: {
        createdAt: 'task createdAt here',
        description: 'task description here',
        dueDate: 'task dueDate here',
        id: 'task id here',
        status: 'pending | in-progress | completed',
        title: 'task title here',
        updatedAt: 'task updatedAt here',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Failed to retrieve task by id',
    schema: {
      example: {
        error: 'Not Found',
        message: 'The task ID does not exist!',
        statusCode: 404,
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;

    return await this.tasksService.findOne(id, userId);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully updated task. Returns true.',
  })
  @ApiNotFoundResponse({
    description: 'Failed to retrieve task by id',
    schema: {
      example: {
        error: 'Not Found',
        message: 'The task ID does not exist!',
        statusCode: 404,
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    const userId = req.user.id;

    return await this.tasksService.update(id, updateTaskDto, userId);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully deleted task. Returns true',
  })
  @ApiNotFoundResponse({
    description: 'Failed to delete task by id',
    schema: {
      example: {
        error: 'Not Found',
        message: 'The task ID does not exist!',
        statusCode: 404,
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;

    return await this.tasksService.remove(id, userId);
  }
}
