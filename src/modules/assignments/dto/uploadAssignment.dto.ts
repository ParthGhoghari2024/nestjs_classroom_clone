import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentDto } from './createAssignment.dto';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadAssignmentDto {
  @IsNumber()
  @Type(() => Number)
  assignmentId: number;
}
