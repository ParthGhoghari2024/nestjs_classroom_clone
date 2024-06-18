import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Class } from 'src/modules/classes/entities/class.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { StudentClasses } from 'src/modules/studentClass/entities/studentClass.entity';
import { Submission } from 'src/modules/submissions/entities/submission.entity';
import { TeacherClasses } from 'src/modules/teacherClass/entities/teacherClass.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@Index(['email'], {
  unique: true,
  where: 'deletedAt is null',
})
@Index(['username'], {
  unique: true,
  where: 'deletedAt is null',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  roleId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToMany(() => Assignment, (assignment) => assignment.teacher)
  assignments: Assignment[];

  @OneToMany(() => StudentClasses, (studentClass) => studentClass.student, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  studentClasses: StudentClasses[];

  @OneToMany(() => TeacherClasses, (teacherClass) => teacherClass.teacher, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  teacherClasses: TeacherClasses[];

  @OneToMany(() => Submission, (submission) => submission.student)
  submissions: Submission[];
}
