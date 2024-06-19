import { Module } from '@nestjs/common';
import { AttachementsEntityService } from './attachementsEntity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsEntity } from './entities/attachementsEntity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttachmentsEntity])],
  controllers: [],
  providers: [AttachementsEntityService],
  exports: [AttachementsEntityService],
})
export class AttachementsEntityModule {}
