import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Class } from 'src/modules/classes/entities/class.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'student_classes' })
// @Index(['students', 'class'], {
//   where: 'deletedAt not null',
// })
export class StudentClasses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  classId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.studentClasses)
  @JoinColumn({ name: 'userId' })
  students: User;

  @ManyToOne(() => Class, (classEntity) => classEntity.students)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
