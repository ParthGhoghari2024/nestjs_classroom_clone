import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({
    example: 'test',
    required: true,
  })
  @IsNumber()
  classId: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  teacherId?: number;

  @ApiProperty({
    example: 'test',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'test',
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '2024-06-20',
    required: true,
  })
  @IsString()
  dueDate: Date;
}
