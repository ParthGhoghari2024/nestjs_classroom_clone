import { PartialType } from '@nestjs/mapped-types';
import { LoginDto } from './loginAuth.dto';

export class UpdateAuthDto extends PartialType(LoginDto) {}
