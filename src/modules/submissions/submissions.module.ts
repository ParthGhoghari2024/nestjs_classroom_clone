import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
