import { Module } from '@nestjs/common';
import { AttachementsEntityService } from './attachementsEntity.service';
import { AttachementsEntityController } from './attachementsEntity.controller';

@Module({
  controllers: [AttachementsEntityController],
  providers: [AttachementsEntityService],
})
export class AttachementsEntityModule {}
