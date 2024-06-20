import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Submission } from 'src/modules/submissions/entities/submission.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PolymorphicParent, PolymorphicRepository } from 'typeorm-polymorphic';
import { PolymorphicChildInterface } from 'typeorm-polymorphic/dist/polymorphic.interface';

@Entity('adverts')
export class Attach implements PolymorphicChildInterface {
  @PrimaryGeneratedColumn()
  id: number;
  @PolymorphicParent(() => [Assignment, Submission])
  owner: Assignment | Submission;

  @Column()
  entityId: number;

  @Column()
  entityType: 'assignment' | 'submission';

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
