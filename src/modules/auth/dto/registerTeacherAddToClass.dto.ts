import { IsNumber } from 'class-validator';
import { registerDto } from './register.dto';

export class RegisterTeacherAndAddToClass extends registerDto {
  @IsNumber()
  public UIds: string[];
}
