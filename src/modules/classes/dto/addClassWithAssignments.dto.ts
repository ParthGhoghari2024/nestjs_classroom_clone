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
export class AddClassWithAssignments {
  @ApiProperty({
    example: 'test',
    required: true,
  })
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ClassAssignmentDto)
  assignments: ClassAssignmentDto[];
}

class ClassAssignmentDto {
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
