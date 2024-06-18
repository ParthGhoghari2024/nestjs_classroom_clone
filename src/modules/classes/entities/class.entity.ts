import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { TeacherClasses } from 'src/modules/teacherClass/entities/teacherClass.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'classes' })
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  UId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => Assignment, (assignment) => assignment.class)
  assignments: Assignment[];

  @ManyToMany(() => User, (user) => user.studentClasses)
  students: User[];

  // @ManyToMany(() => User, (user) => user.teacherClasses)
  // @JoinTable({
  //   name: 'teacher_classes',
  //   joinColumn: {
  //     name: 'classId',
  //     referencedColumnName: 'id',
  //   },
  // })
  // teachers: User[];

  @OneToMany(() => TeacherClasses, (teacherClass) => teacherClass.class, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  teachers: TeacherClasses[];
}
