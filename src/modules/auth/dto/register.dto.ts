import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsString } from 'class-validator';

export class registerDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsAlpha()
  username: string;

  @ApiProperty({
    required: true,
    type: 'string',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    type: 'string',
    format: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
    type: 'string',
    format: 'password',
  })
  @IsString()
  confirmPassword: string;
}
