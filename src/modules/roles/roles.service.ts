import { Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  private readonly logger: Logger = new Logger(RolesService.name);

  // @InjectRepository(Role)
  // private readonly rolesRepository: Repository<Role>;

  async getRoleByUserId(usreId: number) {
    try {
      return await this.rolesRepository.findOne({
        where: {
          id: usreId,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all roles`;
  }

  async findOne(id: number) {
    return await this.rolesRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  async findByRole(role: string) {
    return await this.rolesRepository.findOneOrFail({
      where: {
        role: role,
      },
    });
  }
}
