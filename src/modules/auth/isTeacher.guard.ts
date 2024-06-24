import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/entities/role.entity';
import { RolesEnum } from 'src/types/constants';

@Injectable()
export class IsTeacherGuard implements CanActivate {
  constructor(private roleService: RolesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.user) {
      throw new UnauthorizedException();
    }
    try {
      let role: string = req.user.role;
      const roleId: number = req.user.roleId;

      if (!role) {
        const roleByRoleId: Role = await this.roleService.findOne(roleId);
        role = roleByRoleId.role;
      }
      if (role !== RolesEnum.Teacher) {
        throw new Error("Teacher's role needed  ");
      }
    } catch (error) {
      throw new UnauthorizedException(error.message || '');
    }
    return true;
  }
}
