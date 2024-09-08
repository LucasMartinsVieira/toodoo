import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? '.env.test'
          : process.env.NODE_ENV === 'development'
            ? '.env.local'
            : '.env.production',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [User, Task],
      synchronize: process.env.NODE_ENV === 'development' ? true : false,
      extra: {
        authPlugins: {
          mysql_native_password: () =>
            require('mysql2/lib/auth_plugins/mysql_native_password'),
        },
      },
    }),
    UsersModule,
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
