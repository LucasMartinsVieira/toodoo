import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  const mockUserId = {
    id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
  };

  const mockTasksService = {
    create: jest.fn().mockResolvedValue(true),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(tasksController).toBeDefined();
    expect(tasksService).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'test task',
        description: 'Test Description',
      };
      // Call the controller method and assert the behavior
      const result = await tasksController.create(createTaskDto, {
        user: { id: mockUserId } as any,
      });

      // Expect that the service's create method was called with the correct arguments
      expect(tasksService.create).toHaveBeenCalledWith(
        createTaskDto,
        mockUserId,
      );

      // The result should be true as per the mock implementation
      expect(result).toBe(true);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const userId = 'userId';
      const result = [
        {
          id: 'taskId',
          title: 'Test Task',
          description: 'Test Description',
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: TaskStatus.PENDING,
          user: {
            id: userId,
            name: 'John Doe',
            email: 'john.doe@email.com',
            password: '123456',
            createdAt: new Date(),
            updatedAt: new Date(),
            tasks: [],
          } as User,
        },
      ];

      jest.spyOn(tasksService, 'findAll').mockResolvedValue(result);

      expect(
        await tasksController.findAll({ user: { id: userId } as any }),
      ).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const userId = 'userId';
      const id = 'taskId';
      const result = {
        id,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: TaskStatus.PENDING,
        user: {
          id: userId,
          name: 'John Doe',
          email: 'john.doe@email.com',
          password: '123456',
          createdAt: new Date(),
          updatedAt: new Date(),
          tasks: [],
        } as User,
      };

      jest.spyOn(tasksService, 'findOne').mockResolvedValue(result);

      expect(
        await tasksController.findOne(id, { user: { id: userId } as any }),
      ).toBe(result);
    });

    it('should throw an NotFoundException if task not found', async () => {
      const userId = 'userId';
      const id = 'taskId';
      jest
        .spyOn(tasksService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(
        tasksController.findOne(id, { user: { id: userId } as any }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const userId = 'userId';
      const id = 'taskId';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: new Date(),
      };

      jest.spyOn(tasksService, 'update').mockResolvedValue(true);

      expect(
        await tasksController.update(id, updateTaskDto, {
          user: { id: userId } as any,
        }),
      ).toBe(true);
    });

    it('should throw an exception if task not found', async () => {
      const userId = 'userId';
      const id = 'taskId';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: new Date(),
      };
      jest
        .spyOn(tasksService, 'update')
        .mockRejectedValue(new NotFoundException());

      await expect(
        tasksController.update(id, updateTaskDto, {
          user: { id: userId } as any,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const userId = 'userId';
      const id = 'taskId';

      jest.spyOn(tasksService, 'remove').mockResolvedValue(true);

      expect(
        await tasksController.remove(id, { user: { id: userId } as any }),
      ).toBe(true);
    });

    it('should throw an exception if task not found', async () => {
      const userId = 'userId';
      const id = 'taskId';
      jest
        .spyOn(tasksService, 'remove')
        .mockRejectedValue(new NotFoundException());

      await expect(
        tasksController.remove(id, { user: { id: userId } as any }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
