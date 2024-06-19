import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsNumber()
  classId: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  teacherId?: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  dueDate: Date;
}
