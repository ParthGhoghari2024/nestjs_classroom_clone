import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import generateUniqueId from 'generate-unique-id';
import { UsersService } from '../users/users.service';
import { TeacherClasses } from '../teacherClass/entities/teacherClass.entity';
@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,

    private readonly userRepository: UsersService,
  ) {}
  async create(createClassDto: CreateClassDto) {
    const newClass: Class = new Class();

    const UId: string = generateUniqueId({
      length: 6,
    });
    newClass.name = createClassDto.name;
    newClass.UId = UId;

    return this.classesRepository.save(newClass);
  }

  async findAll(): Promise<Class[]> {
    return this.classesRepository.find({
      select: {
        id: true,
        UId: true,
        name: true,
        // students: {
        //   id: true,
        //   username: true,
        //   email: true,
        // },
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
        // students: true,
        teachers: true,
        assignments: {
          teacher: true,
        },
      },
      // },
    });
  }

  findOne(id: number): Promise<Class> {
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
          username: true,
          email: true,
        },
        teachers: {
          // id: true,
          // username: true,
          // email: true,
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
        teachers: true,
        students: true,
        assignments: {
          teacher: true,
        },
      },
    });
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  async remove(id: number) {
    await this.classesRepository.softDelete(id);
  }

  async restore(id: number) {
    return await this.classesRepository.restore(id);
  }

  async addTeacherToClass(classId: number, teacherId: number) {
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
  }
}
