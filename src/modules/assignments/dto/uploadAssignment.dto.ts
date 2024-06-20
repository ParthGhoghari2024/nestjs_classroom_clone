import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentDto } from './createAssignment.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UploadAssignmentDto {
  // @IsNumber()
  @Type(() => Number)
  assignmentId: number;
  // @ApiProperty({
  //   example: 'test',
  //   required: true,
  // })
  // @IsNumber()
  // classId: number;
  // @IsNumber()
  // @IsOptional()
  // @IsNotEmpty()
  // teacherId?: number;
  // @ApiProperty({
  //   example: 'test',
  //   required: true,
  // })
  // @IsString()
  // title: string;
  // @ApiProperty({
  //   example: 'test',
  //   required: true,
  // })
  // @IsString()
  // description: string;
  // @ApiProperty({
  //   example: '2024-06-20',
  //   required: true,
  // })
  // @IsString()
  // dueDate: Date;
}
