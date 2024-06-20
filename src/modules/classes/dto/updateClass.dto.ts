import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './createClass.dto';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassDto extends PartialType(CreateClassDto) {
  @ApiProperty({
    example: 'test',
    required: true,
  })
  @IsString()
  name: string;
}
