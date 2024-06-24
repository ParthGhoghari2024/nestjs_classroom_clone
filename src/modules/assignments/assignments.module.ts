import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { AttachementsEntityModule } from '../attachementsEntity/attachementsEntity.module';
import { ClassesModule } from '../classes/classes.module';
import { ValidateAssignmentOwner } from './assignments.middleware';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment]),
    forwardRef(() => AttachementsEntityModule),
    ClassesModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
// export class AssignmentsModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(ValidateAssignmentOwner).forRoutes({
//       path: 'assignment/attachment/:id',
//       method: RequestMethod.POST,
//     });
//   }
// }
