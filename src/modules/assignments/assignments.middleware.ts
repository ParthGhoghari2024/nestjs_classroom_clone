import {
  Body,
  Injectable,
  Logger,
  NestMiddleware,
  Next,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UploadAssignmentDto } from './dto/uploadAssignment.dto';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { plainToClass } from 'class-transformer';
import { AssignmentsService } from './assignments.service';
import { ClassesService } from '../classes/classes.service';
import { Assignment } from './entities/assignment.entity';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Injectable()
export class ValidateAssignmentOwner implements NestMiddleware {
  constructor(
    private readonly assignmentsService: AssignmentsService,

    private readonly classesService: ClassesService,
  ) {}
  private logger: Logger = new Logger(ValidateAssignmentOwner.name);
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('nice');

      // const validationPipe = new ValidationPipe({
      //   transform: true,
      //   whitelist: true,
      // });

      // const validatedBody = await validationPipe.transform(
      //   UploadAssignmentDto,
      //   req.body,
      // );

      // req.body = validatedBody;
      // const { classId } = req.body;

      const assignmentId: number = Number(req.params.id);

      const userId: number = req.user.id;

      const assignmentData: Assignment =
        await this.assignmentsService.findWithRelations(assignmentId);

      console.log(assignmentData);

      if (assignmentData.teacherId !== userId) {
        return generalJsonResponse(
          res,
          { success: 0, invalidOwner: 1 },
          'Invalid assignment owner',
          'error',
          false,
          403,
        );
      }

      next();
    } catch (error) {
      this.logger.error(error);
      generalJsonResponse(
        res,
        { success: 0 },
        'Validation failed',
        'error',
        false,
        403,
      );
    }
  }
}
