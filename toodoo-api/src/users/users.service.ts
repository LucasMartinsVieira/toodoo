import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    const salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(user.password, salt);

    if (
      await this.usersRepository.exist({
        where: {
          email: createUserDto.email,
        },
      })
    ) {
      throw new BadRequestException('This email is already been used');
    }
    return await this.usersRepository.save(user);
  }

  async findAll() {
    const users = await this.usersRepository.find();

    if (users.length === 0)
      throw new HttpException('Users not found!', HttpStatus.NOT_FOUND);

    return users;
  }

  async findOne(id: string) {
    await this.idExists(id);

    return await this.usersRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.idExists(id);

    const salt = await bcrypt.genSalt();

    updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);

    await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    await this.idExists(id);

    await this.usersRepository.delete(id);

    return true;
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async validateUser(email: string, pass: string) {
    const user = await this.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      delete user.password;

      return user;
    }
  }

  async idExists(id: string) {
    if (
      !(await this.usersRepository.exist({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`The user ${id} does not exist!`);
    }
  }
}
