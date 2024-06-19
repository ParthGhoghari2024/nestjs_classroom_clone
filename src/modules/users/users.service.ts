import { getRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();

    const role = await this.roleService.findByRole('student');

    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.roleId = role.id;

    // user.role = role;

    return this.usersRepository.save(user);
    // return 'This action adds a new user';
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    //TODO:
    return `This action updates a #${id} user`;
  }

  async restore(id: number) {
    return await this.usersRepository.restore({ id: id });
  }
}
