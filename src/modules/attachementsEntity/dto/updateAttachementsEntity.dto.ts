import { PartialType } from '@nestjs/mapped-types';
import { CreateAttachementsEntityDto } from './createAttachementsEntity.dto';

export class UpdateAttachementsEntityDto extends PartialType(
  CreateAttachementsEntityDto,
) {}
