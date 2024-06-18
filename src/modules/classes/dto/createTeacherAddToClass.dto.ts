import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { registerDto } from 'src/modules/auth/dto/register.dto';
export class createTeacherAddToClass extends registerDto {
  // classIds: number[];
  classId: number;
}
