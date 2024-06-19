import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherClassDto } from './createTeacherClass.dto';

export class UpdateTeacherClassDto extends PartialType(CreateTeacherClassDto) {}
