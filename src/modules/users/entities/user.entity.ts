import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Class } from 'src/modules/classes/entities/class.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { TeacherClasses } from 'src/modules/teacherClass/entities/teacherClass.entity';
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

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

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

  @ManyToMany(() => Class)
  studentClasses: Class[];

  // @ManyToMany(() => Class, (classEntity) => classEntity.teachers)
  // @JoinTable({
  //   name: 'teacher_classes',
  //   joinColumn: {
  //     name: 'userId',
  //     referencedColumnName: 'id',
  //   },
  // })
  // teacherClasses: Class[];

  @ManyToOne(() => TeacherClasses, (teacherClass) => teacherClass.teacher, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  teacherClasses: TeacherClasses[];
}
