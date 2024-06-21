import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { StudentClasses } from 'src/modules/studentClass/entities/studentClass.entity';
import { Submission } from 'src/modules/submissions/entities/submission.entity';
import { TeacherClasses } from 'src/modules/teacherClass/entities/teacherClass.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => Assignment, (assignment) => assignment.class, {
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  })
  assignments: Assignment[];

  @OneToMany(() => StudentClasses, (studentClass) => studentClass.class, {
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  })
  students: StudentClasses[];

  @OneToMany(() => TeacherClasses, (teacherClass) => teacherClass.class, {
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  })
  teachers: TeacherClasses[];

  @OneToMany(() => Submission, (submission) => submission.class, {
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  })
  submissions: Submission[];
}
