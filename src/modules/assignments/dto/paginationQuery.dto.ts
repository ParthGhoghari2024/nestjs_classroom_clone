import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class PaginationQuery {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumberString()
  currentPage: number;
}
