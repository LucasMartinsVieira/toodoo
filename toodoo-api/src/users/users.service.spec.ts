import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  const mockUser = {
    id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
    name: 'John Doe',
    email: 'john.doe@email.com',
    password: '123456',
  };

  const mockUserRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    exist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockUserRepository.exist.mockResolvedValue(false);

      const result = await usersService.create({
        name: 'John Doe',
        email: 'john.doe@email.com',
        password: '123456',
      });

      // Check that the password was hashed
      expect(result.password).not.toEqual('123456');

      // Verify that the hashed password matches the original password
      const isPasswordMatching = await bcrypt.compare(
        '123456',
        result.password,
      );

      expect(isPasswordMatching).toBe(true);

      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw a BadRequestException if user cannot be saved', async () => {
      mockUserRepository.exist.mockResolvedValue(false);
      mockUserRepository.save.mockRejectedValue(new Error());

      await expect(
        usersService.create({
          name: 'John Doe',
          email: 'john.doe@email.com',
          password: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserRepository.find.mockResolvedValue([mockUser]);

      const result = await usersService.findAll();

      expect(result).toEqual([mockUser]);
      expect(usersRepository.find).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if no users are found', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      await expect(usersService.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.exist.mockResolvedValue(true);

      const result = await usersService.findOne(
        'bfd699fb-696e-40c7-8a54-e35e80b2668e',
      );

      expect(result).toEqual(mockUser);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
      });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      mockUserRepository.exist.mockResolvedValue(false);

      await expect(
        usersService.findOne('bfd699fb-696e-40c7-8a54-e35e80b2668e'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should successfully update a user', async () => {
      mockUserRepository.exist.mockResolvedValue(true);

      const result = await usersService.update(
        'bfd699fb-696e-40c7-8a54-e35e80b2668e',
        {
          email: 'new@example.com',
        },
      );

      expect(result).toEqual(true);
      expect(usersRepository.update).toHaveBeenCalledWith(
        'bfd699fb-696e-40c7-8a54-e35e80b2668e',
        {
          email: 'new@example.com',
        },
      );
    });

    it('should throw a NotFoundException if user is not found', async () => {
      mockUserRepository.exist.mockResolvedValue(false);

      await expect(
        usersService.update('bfd699fb-696e-40c7-8a54-e35e80b2668e', {
          email: 'new@example.com',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a BadRequestException if user cannot be updated', async () => {
      mockUserRepository.exist.mockResolvedValue(true);
      mockUserRepository.update.mockRejectedValue(new Error());

      await expect(
        usersService.update('bfd699fb-696e-40c7-8a54-e35e80b2668e', {
          email: 'new@example.com',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('remove', () => {
    it('should successfully remove a user', async () => {
      mockUserRepository.exist.mockResolvedValue(true);
      mockUserRepository.delete.mockResolvedValue(true);

      const result = await usersService.remove(
        'bfd699fb-696e-40c7-8a54-e35e80b2668e',
      );

      expect(result).toEqual(true);
      expect(usersRepository.delete).toHaveBeenCalledWith(
        'bfd699fb-696e-40c7-8a54-e35e80b2668e',
      );
    });

    it('should throw a NotFoundException if user is not found', async () => {
      mockUserRepository.exist.mockResolvedValue(false);

      await expect(usersService.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
