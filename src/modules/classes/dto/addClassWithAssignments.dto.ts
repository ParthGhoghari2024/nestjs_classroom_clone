import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
class ClassAssignmentDto {
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  teacherId?: number;

  @ApiProperty({
    example: 'test',
    required: true,
    type: 'string',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'test',
    required: true,
    type: 'string',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '2024-06-18',
    required: true,
    type: 'string',
  })
  @IsString()
  dueDate: Date;
}
export class AddClassWithAssignments {
  @ApiProperty({
    example: 'test',
    required: true,
    type: 'string',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    required: true,
    isArray: true,
    type: ClassAssignmentDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ClassAssignmentDto)
  assignments: ClassAssignmentDto[];
}
