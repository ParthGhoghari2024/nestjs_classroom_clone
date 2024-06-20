import { Injectable } from '@nestjs/common';
import { CreateAttachDto } from './dto/create-attach.dto';
import { UpdateAttachDto } from './dto/update-attach.dto';

@Injectable()
export class AttachService {
  create(createAttachDto: CreateAttachDto) {
    return 'This action adds a new attach';
  }

  findAll() {
    return `This action returns all attach`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attach`;
  }

  update(id: number, updateAttachDto: UpdateAttachDto) {
    return `This action updates a #${id} attach`;
  }

  remove(id: number) {
    return `This action removes a #${id} attach`;
  }
}
