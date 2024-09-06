import {
  BadRequestException,
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
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  private encryptionKey: Buffer;

  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly configService: ConfigService,
  ) {
    // Retrieve the encryption key from the environment variable
    const keyHex = this.configService.get<string>('ENCRYPTION_KEY');
    if (!keyHex || keyHex.length !== 64) {
      throw new Error('Invalid encryption key length');
    }
    this.encryptionKey = Buffer.from(keyHex, 'hex'); // Convert hex key to Buffer
  }

  // Encrypt data using AES-GCM
  encryptData(data: string): string {
    const iv = crypto.randomBytes(12); // AES-GCM typically uses a 12-byte IV
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
  }

  // Decrypt data using AES-GCM
  decryptData(encryptedData: string): string {
    const [ivHex, encryptedHex, authTagHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.encryptionKey,
      iv,
    );
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    // eslint-disable-next-line prefer-const
    let { title, description, status, dueDate } = createTaskDto;

    if (!user) {
      throw new NotFoundException(`User ${userId} not found!`);
    }

    if (description === undefined || description === null) {
      // Use an empty string or default value if description is not provided
      description = '';
    }

    let encryptedTitle: string;
    let encryptedDescription: string;

    try {
      encryptedTitle = this.encryptData(title);
      encryptedDescription = this.encryptData(description);
    } catch (error) {
      throw new BadRequestException('Encryption failed.');
    }

    const task = this.tasksRepository.create({
      title: encryptedTitle,
      description: encryptedDescription,
      status,
      dueDate,
      user,
    });

    try {
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new BadRequestException('Could not create task!');
    }

    return true;
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

    try {
      return tasks.map((task) => ({
        ...task,
        title: this.decryptData(task.title),
        description: this.decryptData(task.description),
      }));
    } catch (e) {
      throw new BadRequestException('Could not retrieve tasks!');
    }
  }

  async findOne(id: string, userId: string) {
    this.idExists(id);

    const task = await this.tasksRepository.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
    });

    const decryptedTitle = this.decryptData(task.title);
    const decryptedDescription = this.decryptData(task.description);

    return {
      ...task,
      title: decryptedTitle,
      description: decryptedDescription,
    };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    await this.idExists(id);

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found!`);
    }
    // Encrypt fields that need encryption
    const updatedFields: Partial<Task> = {
      ...updateTaskDto,
      user,
    };

    this.tasksRepository.create({
      ...updateTaskDto,
      user,
    });

    if (updateTaskDto.title) {
      updatedFields.title = this.encryptData(updateTaskDto.title);
    }

    if (updateTaskDto.description) {
      updatedFields.description = this.encryptData(updateTaskDto.description);
    }

    try {
      await this.tasksRepository.update(id, updatedFields);
    } catch (e) {
      throw new BadRequestException('Could not update task!');
    }

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
