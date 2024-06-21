import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Submission } from 'src/modules/submissions/entities/submission.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'attachments' })
export class AttachmentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attachmentId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.attachments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Assignment, (assignment) => assignment.attachments, {
    nullable: true,
  })
  @JoinColumn({ name: 'attachmentId' })
  assignmentAttachment: Assignment;

  @ManyToOne(() => Submission, (submission) => submission.attachments, {
    nullable: true,
  })
  @JoinColumn({ name: 'attachmentId' })
  submissionAttachment: Submission;

  @Column()
  attachmentType: 'assignment' | 'submission';

  @Column()
  original_filename: string;

  @Column()
  new_filename: string;

  @Column({ type: 'tinytext' })
  path: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
