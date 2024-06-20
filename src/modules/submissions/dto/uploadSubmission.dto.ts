import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadSubmissionDto {
  @IsNumber()
  @Type(() => Number)
  submissionId: number;
}
