import { Injectable, Logger } from '@nestjs/common';
import { CreateClassDto } from './dto/createClass.dto';
import { UpdateClassDto } from './dto/updateClass.dto';
import { Class } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  In,
  Repository,
  Transaction,
  getManager,
} from 'typeorm';
import generateUniqueId from 'generate-unique-id';
import { UsersService } from '../users/users.service';
import { TeacherClasses } from '../teacherClass/entities/teacherClass.entity';
import { StudentClasses } from '../studentClass/entities/studentClass.entity';
import { AuthService } from '../auth/auth.service';
import { registerDto } from '../auth/dto/register.dto';
import { TeacherClassesService } from '../teacherClass/teacherClasses.service';
import { User } from '../users/entities/user.entity';
import { CreateTeacherClassDto } from '../teacherClass/dto/createTeacherClass.dto';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { RegisterTeacherAndAddToClass } from '../auth/dto/registerTeacherAddToClass.dto';
import { AddClassWithAssignments } from './dto/addClassWithAssignments.dto';
import { Assignment } from '../assignments/entities/assignment.entity';
import { AssignmentsService } from '../assignments/assignments.service';
import { RolesEnum } from 'src/types/constants';
@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,

    private readonly userService: UsersService,
    private readonly authService: AuthService,

    private readonly teacherClassesService: TeacherClassesService,
    private entityManager: EntityManager,
  ) {}

  private readonly logger = new Logger(ClassesService.name);

  async create(createClassDto: CreateClassDto, userId: number) {
    try {
      const newClass: Class = new Class();

      const UId: string = generateUniqueId({
        length: 6,
      });
      newClass.name = createClassDto.name;
      newClass.UId = UId;
      newClass.userId = userId;

      const teacherClass: TeacherClasses = new TeacherClasses();
      teacherClass.userId = userId;

      newClass.teachers = [teacherClass];
      return this.classesRepository.save(newClass);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async findAll(): Promise<Class[]> {
    try {
      return this.classesRepository.find({
        select: {
          id: true,
          UId: true,
          name: true,
          students: {
            student: {
              id: true,
              email: true,
              username: true,
            },
          },
          teachers: true,
          assignments: {
            title: true,
            description: true,
            dueDate: true,
            teacher: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
        relations: {
          students: true,
          teachers: true,
          assignments: {
            teacher: true,
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  findOne(id: number): Promise<Class> {
    try {
      return this.classesRepository.findOne({
        where: {
          id: id,
        },
        select: {
          id: true,
          UId: true,
          name: true,
          students: {
            id: true,
            student: {
              id: true,
              email: true,
              username: true,
            },
          },
          teachers: {
            id: true,
            teacher: {
              id: true,
              username: true,
              email: true,
            },
          },
          assignments: {
            title: true,
            description: true,
            dueDate: true,
            teacher: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
        relations: {
          teachers: {
            teacher: true,
          },
          students: {
            student: true,
          },
          assignments: {
            teacher: true,
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  findWithRelations(id: number): Promise<Class> {
    try {
      return this.classesRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          teachers: {
            teacher: true,
          },
          students: {
            student: true,
          },
          assignments: {
            teacher: true,
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
  async update(id: number, updateClassDto: UpdateClassDto) {
    return await this.classesRepository.update(id, updateClassDto);
  }

  async remove(id: number) {
    try {
      const classEntity: Class = await this.classesRepository.findOne({
        where: { id },
        relations: {
          assignments: true,
        },
      });
      return await this.classesRepository.softRemove(classEntity);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async restore(id: number) {
    try {
      const classEntity: Class = await this.classesRepository.findOne({
        where: { id },
        relations: {
          assignments: true,
        },
        withDeleted: true,
      });

      return await this.classesRepository.recover(classEntity);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async addTeacherToClass(classId: number, teacherId: number) {
    try {
      const classResult: Class = await this.classesRepository.findOne({
        where: {
          id: classId,
        },
        relations: {
          teachers: true,
        },
      });

      const teacherResult: User = await this.userService.findOne(teacherId);

      const teacherClass: TeacherClasses = new TeacherClasses();
      teacherClass.classId = classId;
      teacherClass.userId = teacherResult.id;

      classResult.teachers.push(teacherClass);

      return await this.classesRepository.save(classResult);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async addStudentToClass(classId: number, studentId: number) {
    try {
      const classResult: Class = await this.classesRepository.findOne({
        where: {
          id: classId,
        },
        relations: {
          students: true,
        },
      });

      const studentResult: User = await this.userService.findOne(studentId);

      const studentClass: StudentClasses = new StudentClasses();
      studentClass.classId = classId;
      studentClass.userId = studentResult.id;

      classResult.students.push(studentClass);

      return await this.classesRepository.save(classResult);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createTeacherAddToClass(
    createTeacherAddToClass: RegisterTeacherAndAddToClass,
  ) {
    let newTeacherToClassArr: TeacherClasses[] = [];
    let errorFlag: number = 0;
    try {
      await this.entityManager.transaction(async () => {
        const registerObj: registerDto = {
          username: createTeacherAddToClass.username,
          password: createTeacherAddToClass.password,
          confirmPassword: createTeacherAddToClass.confirmPassword,
          email: createTeacherAddToClass.email,
        };
        let classes: Class[] = [];
        if (createTeacherAddToClass.UIds) {
          // createTeacherAddToClass.UIds = [
          //   ...createTeacherAddToClass.UIds,
          //   'abc',
          // ];

          classes = await Promise.all(
            createTeacherAddToClass.UIds.map(async (UId) => {
              return await this.getClassIdByUId(UId);
            }),
          );

          const nullIds: Class[] = classes.filter(
            (classEntity) => classEntity === null,
          );
          if (nullIds.length != 0) {
            errorFlag = 1;
            throw Error('Wrong Uid');
          }
        }

        const newTeacher: User = await this.authService.register(
          registerObj,
          RolesEnum.Teacher,
        );

        newTeacherToClassArr = await Promise.all(
          classes.map(async (classEntity) => {
            const teacherClassDto: CreateTeacherClassDto = {
              classId: classEntity.id,
              userId: newTeacher.id,
            };
            const newTeacherToClass: TeacherClasses =
              await this.teacherClassesService.save(teacherClassDto);

            return newTeacherToClass;
          }),
        );
      });
      if (errorFlag === 1) return false;
      return newTeacherToClassArr;
    } catch (error) {
      this.logger.error(error);
    }
  }
  async getClassIdByUId(UId: string) {
    let classEntity: Class;
    try {
      classEntity = await this.entityManager.transaction(async () => {
        return await this.classesRepository.findOne({
          where: {
            UId: UId,
          },
          select: {
            id: true,
          },
        });
      });
    } catch (error) {
      this.logger.error(error);
    }
    return classEntity;
  }

  async addClassWithAssignments(
    addClassWithAssignments: AddClassWithAssignments,
    userId: number,
  ) {
    try {
      const newClass: Class = new Class();

      const UId: string = generateUniqueId({
        length: 6,
      });
      newClass.name = addClassWithAssignments.name;
      newClass.UId = UId;

      const assignmentsArray: Assignment[] = [];
      addClassWithAssignments.assignments.map(async (assignment) => {
        const newAssignement: Assignment = new Assignment();
        newAssignement.title = assignment.title;
        newAssignement.description = assignment.description;
        newAssignement.dueDate = assignment.dueDate;
        newAssignement.teacherId = userId;

        assignmentsArray.push(newAssignement);
      });

      newClass.assignments = assignmentsArray;

      return await this.classesRepository.save(newClass);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getClassIdIfExists(id: number) {
    try {
      return await this.classesRepository.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
