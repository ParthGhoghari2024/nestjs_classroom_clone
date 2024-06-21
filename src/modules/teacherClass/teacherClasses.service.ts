import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherClasses } from './entities/teacherClass.entity';
import { CreateTeacherClassDto } from './dto/createTeacherClass.dto';
import { UpdateTeacherClassDto } from './dto/updateTeacherClass.dto';
@Injectable()
export class TeacherClassesService {
  constructor(
    @InjectRepository(TeacherClasses)
    private readonly teacherClassesRepository: Repository<TeacherClasses>,
  ) {}

  async create(createTeachrClassDto: CreateTeacherClassDto) {
    const teacherClass: TeacherClasses = new TeacherClasses();

    teacherClass.classId = createTeachrClassDto.classId;
    teacherClass.userId = createTeachrClassDto.userId;

    // user.role = role;

    return this.teacherClassesRepository.save(teacherClass);
    // return 'This action adds a new user';
  }

  async findAll(): Promise<TeacherClasses[]> {
    return this.teacherClassesRepository.find();
  }

  findOne(id: number): Promise<TeacherClasses> {
    return this.teacherClassesRepository.findOneBy({ id: id });
  }

  async findByClassId(id: number): Promise<TeacherClasses> {
    return await this.teacherClassesRepository.findOne({
      where: {
        classId: id,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.teacherClassesRepository.softDelete(id);
  }

  update(id: number, updateTeacherClassDto: UpdateTeacherClassDto) {
    //TODO:
    return `This action updates a #${id} user`;
  }

  async restore(id: number) {
    return await this.teacherClassesRepository.restore({ id: id });
  }

  async save(createTeachrClassDto: CreateTeacherClassDto) {
    const teacherClass = new TeacherClasses();

    teacherClass.classId = createTeachrClassDto.classId;
    teacherClass.userId = createTeachrClassDto.userId;

    // user.role = role;

    return this.teacherClassesRepository.save(teacherClass);
    // return 'This action adds a new user';
  }
}
