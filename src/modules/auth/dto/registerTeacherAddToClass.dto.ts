import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { registerDto } from './register.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterTeacherAndAddToClass extends registerDto {
  // @IsNumber()
  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  @IsOptional()
  public UIds: string[];
}
