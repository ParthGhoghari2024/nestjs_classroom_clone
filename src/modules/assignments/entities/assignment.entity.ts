import { AttachmentsEntity } from 'src/modules/attachementsEntity/entities/attachementsEntity.entity';
import { Class } from 'src/modules/classes/entities/class.entity';
import { Submission } from 'src/modules/submissions/entities/submission.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
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
  description: string;

  @Column()
  dueDate: Date;

  @ManyToOne(() => Class, (classModel) => classModel.assignments)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @ManyToOne(() => User, (user) => user.assignments)
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @OneToMany(() => Submission, (submission) => submission.assignment, {
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  })
  submissions: Submission[];

  @OneToMany(
    () => AttachmentsEntity,
    (attachment) => attachment.assignmentAttachment,
    {
      cascade: true,
    },
  )
  attachments: AttachmentsEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
