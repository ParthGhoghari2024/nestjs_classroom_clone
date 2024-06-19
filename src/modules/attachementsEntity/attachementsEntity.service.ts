import { Injectable } from '@nestjs/common';
import { CreateAttachementsEntityDto } from './dto/createAttachementsEntity.dto';
import { UpdateAttachementsEntityDto } from './dto/updateAttachementsEntity.dto';

@Injectable()
export class AttachementsEntityService {
  create(createAttachementsEntityDto: CreateAttachementsEntityDto) {
    return 'This action adds a new attachementsEntity';
  }

  findAll() {
    return `This action returns all attachementsEntity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attachementsEntity`;
  }

  update(id: number, updateAttachementsEntityDto: UpdateAttachementsEntityDto) {
    return `This action updates a #${id} attachementsEntity`;
  }

  remove(id: number) {
    return `This action removes a #${id} attachementsEntity`;
  }
}
