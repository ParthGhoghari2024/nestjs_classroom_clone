import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateClassDto {
  @ApiProperty({
    example: 'test',
    required: true,
  })
  @IsString()
  readonly name: string;
}
