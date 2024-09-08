import { request, app } from '../../test/setup-e2e-spec';
import { User } from '../users/entities/user.entity';
import { getRepository } from 'typeorm';

describe('AuthModule (e2e)', () => {
  let jwtToken: string;

  beforeAll(async () => {
    await getRepository(User).clear();
  });

  it('(POST) /api/auth/register should register a user and return a JWT Token', async () => {
    const user = {
      name: 'fulano',
      email: 'fulano@email.com',
      password: '123456',
    };

    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(user)
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    jwtToken = response.body.access_token;
  });
});
