import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found!`);
    }

    const task = this.tasksRepository.create({
      ...createTaskDto,
      user,
    });

    // TODO: Clean up this response
    return this.tasksRepository.save(task);
  }

  async findAll(userId: string) {
    const tasks = await this.tasksRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (tasks.length === 0) {
      throw new HttpException('Tasks not found!', HttpStatus.NOT_FOUND);
    }

    return tasks;
  }

  async findOne(id: string, userId: string) {
    this.idExists(id);

    const task = await this.tasksRepository.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
    });

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found!`);
    }

    this.tasksRepository.create({
      ...updateTaskDto,
      user,
    });

    await this.tasksRepository.update(id, updateTaskDto);

    return true;
  }

  async remove(id: string, userId: string) {
    this.idExists(id);

    await this.tasksRepository.delete({
      id: id,
      user: { id: userId },
    });

    return true;
  }

  async idExists(id: string) {
    if (
      !(await this.tasksRepository.exist({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`The task ${id} does not exist!`);
    }
  }
}
