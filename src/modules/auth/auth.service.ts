import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { registerDto } from './dto/register.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly roleService: RolesService,
  ) {}
  async login(createAuthDto: CreateAuthDto) {
    // return await this.userRepository.save()
  }
  async register(registerDto: registerDto) {
    const user = new User();

    const role = await this.roleService.findByRole('student');

    user.username = registerDto.username;
    user.email = registerDto.email;
    user.password = registerDto.password;
    user.roleId = role.id;

    // user.role = role;

    return this.usersRepository.save(user);
    // return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
