import { PartialType } from '@nestjs/mapped-types';
import { CreateAttachDto } from './create-attach.dto';

export class UpdateAttachDto extends PartialType(CreateAttachDto) {}
