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

@Entity({ name: 'teacher_classes' })
@Index(['teacher', 'class'], {
  unique: true,
  where: 'deletedAt is  NULL',
})
export class TeacherClasses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  classId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.teacherClasses)
  @JoinColumn({ name: 'userId' })
  teacher: User;

  @ManyToOne(() => Class, (classEntity) => classEntity.teachers)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
