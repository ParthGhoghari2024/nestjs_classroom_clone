import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { Assignment } from './entities/assignment.entity';
import { AssignmentsService } from './assignments.service';
import generalJsonResponse from 'src/helper/generalResponse.helper';

@Injectable()
export class ValidateAssignmentOwnerGuard implements CanActivate {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    try {
      const assignmentId: number = Number(request.params.id);

      const userId: number = request.user.id;

      const assignmentData: Assignment =
        await this.assignmentsService.findWithRelations(assignmentId);

      if (assignmentData.teacherId !== userId) {
        throw new Error('Invalid ownerShip of assignment');
      }
    } catch (error) {
      throw new UnauthorizedException(error.message || '');
    }
    return true;
  }
}
