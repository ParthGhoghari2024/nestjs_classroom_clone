import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';
import { TeacherClasses } from './entities/teacherClass.entity';
import { TeacherClassesService } from './teacherClasses.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherClasses])],
  controllers: [],
  providers: [TeacherClassesService],
  exports: [TeacherClassesService],
})
export class TeacherClassesModule {}
