import { Class } from 'src/modules/classes/entities/class.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'assignments' })
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  classId: number;

  @Column()
  teacherId: number;

  @Column()
  title: string;

  @Column()
  descrption: string;

  @Column()
  dueDate: Date;

  @ManyToOne(() => Class, (classModel) => classModel.assignments)
  @JoinTable({ name: 'classId' })
  class: Class;

  @ManyToOne(() => User, (user) => user.assignments)
  @JoinTable({ name: 'teacherId' })
  teacher: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}