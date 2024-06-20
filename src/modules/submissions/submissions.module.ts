import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { AttachementsEntityModule } from '../attachementsEntity/attachementsEntity.module';

@Module({
  imports: [TypeOrmModule.forFeature([Submission]), AttachementsEntityModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
