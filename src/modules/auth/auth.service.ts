import { Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/loginAuth.dto';
import { UpdateAuthDto } from './dto/updateAuth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { registerDto } from './dto/register.dto';
import { RolesService } from '../roles/roles.service';
import { IRegisterAvailabity } from 'src/types/interface';
import { Role } from '../roles/entities/role.entity';

import argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly roleService: RolesService,
  ) {}

  private readonly SALT: string = process.env.SALT;

  private readonly logger: Logger = new Logger(AuthService.name);
  async checkCredentials(loginDto: LoginDto) {
    try {
      const credentials: User = await this.usersRepository.findOne({
        where: {
          email: loginDto.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          roleId: true,
          password: true,
          role: {
            id: true,
            role: true,
          },
        },
        relations: {
          role: true,
        },
      });

      const match: boolean = await argon2.verify(
        credentials.password,
        loginDto.password,
        {
          secret: Buffer.from(this.SALT),
        },
      );

      if (!match) {
        return false;
      }

      return credentials;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
  async register(registerDto: registerDto, roleName: string = 'student') {
    const user: User = new User();

    const role: Role = await this.roleService.findByRole(roleName);

    user.username = registerDto.username;
    user.email = registerDto.email;
    user.password = registerDto.password;
    user.roleId = role.id;

    // user.role = role;

    return this.usersRepository.save(user);
    // return 'This action adds a new user';
  }

  async checkAvailabity(username: string, email: string) {
    const res: IRegisterAvailabity = {
      usernameAvailabity: 1,
      emailAvailabity: 1,
    };
    try {
      const usernameAvailabity: User = await this.usersRepository.findOne({
        where: {
          username: username,
        },
      });

      const emailAvailabity: User = await this.usersRepository.findOne({
        where: {
          email: email,
        },
      });

      usernameAvailabity && (res.usernameAvailabity = 0);
      emailAvailabity && (res.emailAvailabity = 0);
    } catch (error) {
      this.logger.error(error);
    }
    return res;
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
