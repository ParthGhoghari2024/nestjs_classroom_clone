import { Injectable, Logger } from '@nestjs/common';
import { CreateAttachementsEntityDto } from './dto/createAttachementsEntity.dto';
import { UpdateAttachementsEntityDto } from './dto/updateAttachementsEntity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AttachmentsEntity } from './entities/attachementsEntity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttachementsEntityService {
  constructor(
    @InjectRepository(AttachmentsEntity)
    private attachementsService: Repository<AttachmentsEntity>,
  ) {}
  private readonly logger = new Logger(AttachementsEntityService.name);
  async create(createAttachementsEntityDto: CreateAttachementsEntityDto) {
    try {
      return await this.attachementsService.save(createAttachementsEntityDto);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createBulk(
    createAttachementsEntityDtos: CreateAttachementsEntityDto[],
  ) {
    try {
      return await this.attachementsService.save(createAttachementsEntityDtos);
    } catch (error) {
      this.logger.error(error);
    }
  }

  findAll() {
    return `This action returns all attachementsEntity`;
  }

  async findByAttachmentId(id: number) {
    return await this.attachementsService.find({
      where: {
        attachmentId: id,
        // attachmentType: 'assignment',
      },
      select: {
        path: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.attachementsService.findOne({
      where: {
        attachmentId: id,
        attachmentType: 'assignment',
      },
    });
  }

  update(id: number, updateAttachementsEntityDto: UpdateAttachementsEntityDto) {
    return `This action updates a #${id} attachementsEntity`;
  }

  remove(id: number) {
    return `This action removes a #${id} attachementsEntity`;
  }
}
