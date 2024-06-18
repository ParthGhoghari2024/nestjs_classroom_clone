import { Injectable, Logger } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import generateUniqueId from 'generate-unique-id';
import { UsersService } from '../users/users.service';
import { TeacherClasses } from '../teacherClass/entities/teacherClass.entity';
import { StudentClasses } from '../studentClass/entities/studentClass.entity';
@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,

    private readonly userRepository: UsersService,
  ) {}

  private readonly logger = new Logger(ClassesService.name);
  async create(createClassDto: CreateClassDto) {
    try {
      const newClass: Class = new Class();

      const UId: string = generateUniqueId({
        length: 6,
      });
      newClass.name = createClassDto.name;
      newClass.UId = UId;

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
            descrption: true,
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
            descrption: true,
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

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  async remove(id: number) {
    try {
      await this.classesRepository.softDelete(id);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async restore(id: number) {
    try {
      return await this.classesRepository.restore(id);
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

      const teacherResult = await this.userRepository.findOne(teacherId);

      const teacherClass = new TeacherClasses();
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

      const studentResult = await this.userRepository.findOne(studentId);

      const studentClass = new StudentClasses();
      studentClass.classId = classId;
      studentClass.userId = studentResult.id;

      classResult.students.push(studentClass);

      return await this.classesRepository.save(classResult);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
