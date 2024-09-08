import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  const userId = {
    id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
  };

  const access_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNpc2xlaWRlQGVtYWlsLmNvbSIsIm5hbWUiOiJzaXNsZWlkZSIsImlkIjoiMWVmZDRlZTktMThjOS00YmNlLWI2YWEtZmM3ODBiMzczMDA2IiwiaWF0IjoxNzI1ODEzMDY1LCJleHAiOjE3MjY0MTc4NjUsImF1ZCI6InVzZXJzIiwiaXNzIjoic2lnbmluIiwic3ViIjoiMWVmZDRlZTktMThjOS00YmNlLWI2YWEtZmM3ODBiMzczMDA2In0.JtU8MSvnW3nEKfw3GkNKawCsgY8YVPCwrH9ApH_Ytz0';

  const mockAuthService = {
    register: jest.fn(() => {
      return {
        access_token,
      };
    }),
    signIn: jest.fn(() => {
      return {
        access_token,
      };
    }),
    profile: jest.fn(() => {
      return {
        id: userId,
        email: 'john.doe@email.com',
        name: 'John Doe',
      };
    }),
    update: jest.fn(() => {
      return {
        name: 'Fulano',
        email: 'fulano@email.com',
        password: String(Math.random().toString(36)),
      };
    }),
    remove: jest.fn(() => {
      return true;
    }),
  };

  const mockAuthGuard: CanActivate = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('Not authenticated routes', () => {
    it('should register a user', async () => {
      expect(
        await authController.register({
          name: 'John Doe',
          email: 'john.doe@email.com',
          password: '123456',
        }),
      ).toEqual({
        access_token: expect.any(String),
      });
    });

    it('should login a user', async () => {
      expect(
        await authController.login({
          email: 'john.doe@email.com',
          password: '123456',
        }),
      ).toEqual({
        access_token: expect.any(String),
      });
    });
  });

  describe('Authenticated routes', () => {
    it('should show user profile info', async () => {
      expect(await authController.profile(userId)).toEqual({
        id: userId,
        email: expect.any(String),
        name: expect.any(String),
      });
    });

    it('should update user profile', async () => {
      expect(
        await authController.update(userId, {
          name: 'Fulano',
          email: 'fulano@email.com',
          password: '65431',
        }),
      ).toEqual({
        name: 'Fulano',
        email: 'fulano@email.com',
        password: expect.any(String),
      });
    });

    it('should delete user', async () => {
      expect(await authController.remove(userId)).toEqual(true);
    });
  });
});
