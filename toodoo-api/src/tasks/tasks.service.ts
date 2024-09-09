import {
  BadRequestException,
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

  /**
   * Encrypts data using AES-GCM.
   *
   * @param {string} data - The plaintext data to encrypt.
   * @returns {string} The encrypted data in the format: `iv:encryptedData:authTag`.
   *
   * @example
   * const encrypted = encryptData('mySensitiveData');
   * console.log(encrypted); // e.g., "a1b2c3d4e5f6:7g8h9i0j1k2l:3m4n5o6p7q8r"
   */
  encryptData(data: string): string {
    const iv = crypto.randomBytes(12); // AES-GCM typically uses a 12-byte IV
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
  }

  /**
   * Decrypts data that was encrypted using AES-GCM.
   *
   * @param {string} encryptedData - The encrypted data in the format: `iv:encryptedData:authTag`.
   * @returns {string} The decrypted plaintext data.
   *
   * @throws {Error} Throws an error if decryption fails (e.g., invalid auth tag).
   *
   * @example
   * try {
   *   const decrypted = decryptData('a1b2c3d4e5f6:7g8h9i0j1k2l:3m4n5o6p7q8r');
   *   console.log(decrypted); // e.g., "mySensitiveData"
   * } catch (error) {
   *   console.error('Decryption failed:', error.message);
   * }
   */
  decryptData(encryptedData: string): string {
    try {
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
    } catch (error) {
      throw new BadRequestException('Decryption failed');
    }
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
      throw new NotFoundException('Tasks not found!');
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
    const task = await this.tasksRepository.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
    });

    if (!task) {
      throw new NotFoundException(`The task ${id} does not exist!`);
    }

    const decryptedTitle = this.decryptData(task.title);
    const decryptedDescription = this.decryptData(task.description);

    return {
      ...task,
      title: decryptedTitle,
      description: decryptedDescription,
    };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`The task ${id} does not exist!`);
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found!`);
    }
    // Encrypt fields that need encryption
    const updatedFields: Partial<Task> = {
      ...updateTaskDto,
      user,
    };

    if (updateTaskDto.title) {
      updatedFields.title = this.encryptData(updateTaskDto.title);
    }

    if (updateTaskDto.description) {
      updatedFields.description = this.encryptData(updateTaskDto.description);
    }

    const { affected } = await this.tasksRepository.update(id, updatedFields);

    if (affected === 0) {
      throw new NotFoundException(
        `Task with ID ${id} not found or does not belong to user ${userId}`,
      );
    }

    return true;
  }

  async remove(id: string, userId: string) {
    const result = await this.tasksRepository.delete({
      id: id,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(`The task ${id} does not exist!`);
    }

    return true;
  }

  /**
   * Checks if a task with the given ID exists in the repository.
   *
   * @async
   * @param {string} id - The unique identifier of the task to check for existence.
   * @returns {Promise<void>} A promise that resolves to void.
   * @throws {NotFoundException} Throws an exception if the task with the specified ID does not exist.
   *
   * @example
   * try {
   *   await idExists('some-task-id');
   *   // Task exists, proceed with other operations
   * } catch (error) {
   *   if (error instanceof NotFoundException) {
   *     console.error(error.message);
   *     // Handle the case where the task does not exist
   *   }
   * }
   */
  async idExists(id: string): Promise<void> {
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
