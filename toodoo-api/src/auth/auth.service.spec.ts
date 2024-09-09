import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
    name: 'John Doe',
    email: 'john.doe@email.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [], // assuming tasks is an array, adjust as necessary
  };

  const mockUsersService = {
    validateUser: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if validation is successful', async () => {
      mockUsersService.validateUser.mockResolvedValue(mockUser);

      const result = await authService.validateUser({
        email: mockUser.email,
        password: 'password',
      });

      expect(result).toEqual(mockUser);
      expect(usersService.validateUser).toHaveBeenCalledWith(
        mockUser.email,
        'password',
      );
    });

    it('should throw an UnauthorizedException if validation fails', async () => {
      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(
        authService.validateUser({
          email: mockUser.email,
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('createToken', () => {
    it('should return an access token', async () => {
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await authService.createToken({
        email: mockUser.email,
        name: mockUser.name,
        id: mockUser.id,
      });

      expect(result).toEqual({ access_token: 'jwt_token' });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { email: mockUser.email, name: mockUser.name, id: mockUser.id },
        {
          expiresIn: '7 days',
          subject: mockUser.id,
          issuer: 'signin',
          audience: 'users',
        },
      );
    });
  });

  describe('checkToken', () => {
    it('should return the data if token is valid', () => {
      mockJwtService.verify.mockReturnValue({
        id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
      });

      const result = authService.checkToken('valid_token');

      expect(result).toEqual({ id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e' });
      expect(jwtService.verify).toHaveBeenCalledWith('valid_token', {
        issuer: 'signin',
        audience: 'users',
      });
    });

    it('should throw BadRequestException if token is invalid', () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.checkToken('invalid_token')).toThrow(
        BadRequestException,
      );
    });
  });

  describe('signIn', () => {
    it('should return a token if crendentials are valid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest
        .spyOn(authService, 'createToken')
        .mockResolvedValue({ access_token: 'jwt_token' });

      const result = await authService.signIn({
        email: mockUser.email,
        password: 'password',
      });

      expect(result).toEqual({ access_token: 'jwt_token' });
      expect(authService.validateUser).toHaveBeenCalledWith({
        email: mockUser.email,
        password: 'password',
      });
      expect(authService.createToken).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      // Simulate failure in validateUser
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(
        authService.signIn({
          email: mockUser.email,
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token creation fails', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest
        .spyOn(authService, 'createToken')
        .mockRejectedValue(new Error('Token creation failed'));

      await expect(
        authService.signIn({
          email: mockUser.email,
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should return a token after successful registration', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      jest
        .spyOn(authService, 'createToken')
        .mockResolvedValue({ access_token: 'jwt_token' });

      const result = await authService.register({
        email: mockUser.email,
        name: mockUser.name,
        password: 'password',
      });

      expect(result).toEqual({ access_token: 'jwt_token' });
      expect(usersService.create).toHaveBeenCalledWith({
        email: mockUser.email,
        name: mockUser.name,
        password: 'password',
      });
      expect(authService.createToken).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an UnauthorizedException if registration fails', async () => {
      mockUsersService.create.mockResolvedValue(null);

      await expect(
        authService.register({
          email: mockUser.email,
          name: mockUser.name,
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token creation fails', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest
        .spyOn(authService, 'createToken')
        .mockRejectedValue(new Error('Token creation failed'));

      await expect(
        authService.register({
          name: mockUser.name,
          email: mockUser.email,
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('profile', () => {
    it('should return a user profile with sensitive information removed', async () => {
      mockUsersService.findOne.mockResolvedValue({
        // ...mockUser,
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.profile(mockUser.id);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
      expect(usersService.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(authService.profile(mockUser.id)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('update', () => {
    it('should call usersService.update with correct parameters', async () => {
      const updateUserDto = { name: 'fulano' };
      mockUsersService.update.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await authService.update(mockUser.id, updateUserDto);

      expect(result).toEqual({ ...mockUser, ...updateUserDto });
      expect(usersService.update).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with correct parameters', async () => {
      mockUsersService.remove.mockResolvedValue(mockUser);

      const result = await authService.remove(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(usersService.remove).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
