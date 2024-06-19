import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Submission } from 'src/modules/submissions/entities/submission.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'attachmets' })
export class AttachmentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attachmentId: number;

  @ManyToOne(() => Assignment, (assignment) => assignment.attachments, {
    nullable: true,
  })
  assignmentAttachment: Assignment;

  @ManyToOne(() => Submission, (submission) => submission.attachments, {
    nullable: true,
  })
  submissionAttachement: Submission;

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
