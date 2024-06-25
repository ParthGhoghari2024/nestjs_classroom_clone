import { Module, forwardRef } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { AttachementsEntityModule } from '../attachementsEntity/attachementsEntity.module';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission]),
    forwardRef(() => AttachementsEntityModule),
   forwardRef(()=>AssignmentsModule)
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
