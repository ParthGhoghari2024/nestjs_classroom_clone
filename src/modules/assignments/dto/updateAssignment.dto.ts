import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentDto } from './createAssignment.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {
  @IsOptional()
  @ApiProperty({
    example: 'test',
    required: true,
  })
  @IsString()
  title: string;

  @IsOptional()
  @ApiProperty({
    example: 'test',
    required: true,
  })
  @IsString()
  description: string;

  @IsOptional()
  @ApiProperty({
    example: '2024-06-20',
    required: true,
  })
  @IsString()
  dueDate: Date;
}
