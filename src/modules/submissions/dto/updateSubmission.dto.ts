import { PartialType } from '@nestjs/mapped-types';
import { CreateSubmissionDto } from './createSubmission.dto';

export class UpdateSubmissionDto extends PartialType(CreateSubmissionDto) {}
