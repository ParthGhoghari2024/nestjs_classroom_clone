import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherClassDto } from './create-teacherClass.dto';

export class UpdateTeacherClassDto extends PartialType(CreateTeacherClassDto) {}
