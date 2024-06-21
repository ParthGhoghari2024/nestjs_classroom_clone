import { Module, forwardRef } from '@nestjs/common';
import { AttachementsEntityService } from './attachementsEntity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsEntity } from './entities/attachementsEntity.entity';
import { AssignmentsModule } from '../assignments/assignments.module';
import { SubmissionsModule } from '../submissions/submissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttachmentsEntity]),
    forwardRef(() => AssignmentsModule),
    forwardRef(() => SubmissionsModule),
  ],
  controllers: [],
  providers: [AttachementsEntityService],
  exports: [AttachementsEntityService],
})
export class AttachementsEntityModule {}
