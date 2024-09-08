import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: Partial<AuthService>;
  let usersService: Partial<UsersService>;
  let reflector: Partial<Reflector>;

  beforeEach(() => {
    authService = {
      checkToken: jest.fn(),
    };

    usersService = {
      findOne: jest.fn(),
    };

    reflector = {
      getAllAndOverride: jest.fn(),
    };

    authGuard = new AuthGuard(
      usersService as UsersService,
      authService as AuthService,
      reflector as Reflector,
    );
  });

  it('should allow access if token is valid', async () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(false);

    const requestMock = {
      headers: {
        authorization: 'Bearer validToken',
      },
      tokenPayload: {
        id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
        name: 'John Doe',
        email: 'john.doe@email.com',
      },
      user: {
        id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
        name: 'John Doe',
        email: 'john.doe@email.com',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => requestMock,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const tokenPayload = {
      id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
      name: 'John Doe',
      email: 'john.doe@email.com',
    };

    (authService.checkToken as jest.Mock).mockReturnValue(tokenPayload);
    (usersService.findOne as jest.Mock).mockResolvedValue({
      id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
      name: 'John Doe',
      email: 'john.doe@email.com',
    });

    const result = await authGuard.canActivate(context);

    expect(result).toBe(true);
    expect(authService.checkToken).toHaveBeenCalledWith('validToken');
    expect(usersService.findOne).toHaveBeenCalledWith(
      'bfd699fb-696e-40c7-8a54-e35e80b2668e',
    );
    expect(requestMock.tokenPayload).toEqual(tokenPayload);
    expect(requestMock.user).toEqual({
      id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
      name: 'John Doe',
      email: 'john.doe@email.com',
    });
  });

  // it('should allow access if route is public', async () => {
  //   reflector.getAllAndOverride = jest.fn().mockReturnValue(true);
  //
  //   const context = {
  //     switchToHttp: () => ({
  //       getRequest: () => ({
  //         headers: {},
  //       }),
  //     }),
  //     getHandler: jest.fn(),
  //     getClass: jest.fn(),
  //   } as unknown as ExecutionContext;
  //
  //   const result = await authGuard.canActivate(context);
  //   expect(result).toBe(true);
  //   expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);
  // });
  //
  // it('should deny access if token is invalid', async () => {
  //   reflector.getAllAndOverride = jest.fn().mockReturnValue(false);
  //
  //   const context = {
  //     switchToHttp: () => ({
  //       getRequest: () => ({
  //         headers: {
  //           authorization: 'Bearer invalidToken',
  //         },
  //       }),
  //     }),
  //     getHandler: jest.fn(),
  //     getClass: jest.fn(),
  //   } as unknown as ExecutionContext;
  //
  //   (authService.checkToken as jest.Mock).mockImplementation(() => {
  //     throw new Error('Invalid token');
  //   });
  //
  //   const result = await authGuard.canActivate(context);
  //   expect(result).toBe(false);
  // });
  //
  // it('should allow access if token is valid', async () => {
  //   reflector.getAllAndOverride = jest.fn().mockReturnValue(false);
  //
  //   const context = {
  //     switchToHttp: () => ({
  //       getRequest: () => ({
  //         headers: {
  //           authorization: 'Bearer validToken',
  //         },
  //       }),
  //     }),
  //     getHandler: jest.fn(),
  //     getClass: jest.fn(),
  //   } as unknown as ExecutionContext;
  //
  //   const tokenPayload = {
  //     id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
  //     name: 'John Doe',
  //     email: 'john.doe@email.com',
  //   };
  //   (authService.checkToken as jest.Mock).mockReturnValue(tokenPayload);
  //   (usersService.findOne as jest.Mock).mockResolvedValue({
  //     id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
  //     name: 'John Doe',
  //     email: 'john.doe@email.com',
  //   });
  //
  //   const result = await authGuard.canActivate(context);
  //   const request = context.switchToHttp().getRequest();
  //
  //   expect(result).toBe(true);
  //   expect(authService.checkToken).toHaveBeenCalledWith('validToken');
  //   expect(usersService.findOne).toHaveBeenCalledWith(
  //     'bfd699fb-696e-40c7-8a54-e35e80b2668e',
  //   );
  //   expect(request.tokenPayload).toEqual(tokenPayload);
  //   expect(request.user).toEqual({
  //     id: 'bfd699fb-696e-40c7-8a54-e35e80b2668e',
  //     name: 'John Doe',
  //     email: 'john.doe@email.com',
  //   });
  // });
});
