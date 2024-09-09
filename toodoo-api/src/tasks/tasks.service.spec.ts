import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: Repository<Task>;
  let usersRepository: Repository<User>;
  let configService: ConfigService;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    exist: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(() => {
      return '33a20b644ae44db9190d5a00173a41d078413baac969564dcb9fc65b35abb202';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
    expect(tasksRepository).toBeDefined();
    expect(usersRepository).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('Encryption and Decryption', () => {
    it('should encrypt and decrypt data correctly', () => {
      const data = 'sensitive data';
      const encrypted = tasksService.encryptData(data);
      const decrypted = tasksService.decryptData(encrypted);
      expect(decrypted).toBe(data);
    });

    it('should throw an error if decryption fails', () => {
      expect(() => tasksService.decryptData('invalid:data:format')).toThrow(
        BadRequestException,
      );
    });

    describe('create', () => {
      it('should create a task successfully', async () => {
        const createTaskDto = {
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.PENDING,
          dueDate: new Date(),
        };
        const mockUser = { id: 'userId' } as User;

        mockUserRepository.findOne.mockResolvedValue(mockUser);
        mockTaskRepository.create.mockReturnValue(createTaskDto);
        mockTaskRepository.save.mockResolvedValue(createTaskDto);

        const result = await tasksService.create(createTaskDto, 'userId');

        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: { id: 'userId' },
        });
        expect(tasksRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({ user: mockUser }),
        );
        expect(tasksRepository.save).toHaveBeenCalled();
        expect(result).toBe(true);
      });

      it('should throw NotFoundException if user not found', async () => {
        const createTaskDto = {
          title: 'Test Task',
          description: 'Test Description',
        };

        mockUserRepository.findOne.mockResolvedValue(null);

        await expect(
          tasksService.create(createTaskDto, 'userId'),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('findAll', () => {
      it('should return a list of tasks with decrypted titles and descriptions', async () => {
        const mockTasks = [
          {
            id: 'taskId',
            title: 'encryptedTitle',
            description: 'encryptedDescription',
            user: { id: 'userId' },
          },
        ];

        mockTaskRepository.find.mockResolvedValue(mockTasks);
        jest
          .spyOn(tasksService, 'decryptData')
          .mockImplementation((data) => data); // Mock decryption

        const result = await tasksService.findAll('userId');

        expect(tasksRepository.find).toHaveBeenCalledWith({
          where: { user: { id: 'userId' } },
        });
        expect(result).toEqual(mockTasks);
      });

      it('should throw NotFoundException if no tasks found', async () => {
        mockTaskRepository.find.mockResolvedValue([]);

        await expect(tasksService.findAll('userId')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('findOne', () => {
      it('should return a task with decrypted title and description', async () => {
        const mockTask = {
          id: 'taskId',
          title: 'encryptedTitle',
          description: 'encryptedDescription',
          user: { id: 'userId' },
        };

        mockTaskRepository.findOne.mockResolvedValue(mockTask);

        jest.spyOn(tasksService, 'decryptData').mockImplementation((data) => {
          const decryptedData = {
            encryptedTitle: 'decryptedTitle',
            encryptedDescription: 'decryptedDescription',
          };
          return decryptedData[data] || data; // Default to input if not found
        });

        const result = await tasksService.findOne('taskId', 'userId');

        expect(tasksRepository.findOne).toHaveBeenCalledWith({
          where: { id: 'taskId', user: { id: 'userId' } },
        });
        expect(result).toEqual({
          id: 'taskId',
          title: 'decryptedTitle',
          description: 'decryptedDescription',
          user: { id: 'userId' },
        });
      });

      it('should throw NotFoundException if task not found', async () => {
        mockTaskRepository.findOne.mockResolvedValue(null);

        await expect(tasksService.findOne('taskId', 'userId')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('update', () => {
      it('should update a task successfully', async () => {
        const updateTaskDto = {
          title: 'Updated Task',
          description: 'Updated Description',
        };

        const mockUser = { id: 'userId' } as User;

        mockUserRepository.findOne.mockResolvedValue(mockUser);
        mockTaskRepository.update.mockResolvedValue({ affected: 1 } as any);

        const result = await tasksService.update(
          'taskId',
          updateTaskDto,
          'userId',
        );

        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: { id: 'userId' },
        });
        expect(tasksRepository.update).toHaveBeenCalled();
        expect(result).toBe(true);
      });

      it('should throw NotFoundException if task not found', async () => {
        mockTaskRepository.update.mockResolvedValue({ affected: 0 } as any);

        await expect(
          tasksService.update('taskId', { title: 'test' }, 'userId'),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should remove a task successfully', async () => {
        mockTaskRepository.delete.mockResolvedValue({ affected: 1 } as any);

        const result = await tasksService.remove('taskId', 'userId');

        expect(tasksRepository.delete).toHaveBeenCalledWith({
          id: 'taskId',
          user: { id: 'userId' },
        });
        expect(result).toBe(true);
      });

      it('should throw NotFoundException if task not found', async () => {
        mockTaskRepository.delete.mockResolvedValue({ affected: 0 } as any);

        await expect(tasksService.remove('taskId', 'userId')).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
