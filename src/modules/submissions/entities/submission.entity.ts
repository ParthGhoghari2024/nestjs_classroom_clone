import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { AttachmentsEntity } from 'src/modules/attachementsEntity/entities/attachementsEntity.entity';
import { Class } from 'src/modules/classes/entities/class.entity';
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

@Entity({ name: 'submissions' })
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  assignmentId: number;

  @Column({ type: 'text' })
  submission: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.submissions)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @OneToMany(
    () => AttachmentsEntity,
    (attachment) => attachment.submissionAttachment,
    { cascade: true },
  )
  attachments: AttachmentsEntity[];

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions)
  @JoinColumn({ name: 'assignmentId' })
  assignment: Assignment;
}
