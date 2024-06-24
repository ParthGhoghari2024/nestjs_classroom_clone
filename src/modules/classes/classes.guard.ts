import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClassesService } from './classes.service';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassGuard implements CanActivate {
  constructor(private readonly classesService: ClassesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    try {
      const classId: number = Number(request.params.id) || request.body.classId;

      const userId: number = request.user.id;

      const classData: Class =
        await this.classesService.findWithRelations(classId);

      const teacherFileteredClass =
        classData.teachers &&
        classData.teachers.filter((teacher) => teacher.userId === userId);

      if (!teacherFileteredClass || teacherFileteredClass.length === 0) {
        throw new Error('Invalid ownerShip of class');
      }
    } catch (error) {
      throw new UnauthorizedException(error.message || '');
    }
    return true;
  }
}
