import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/createAssignment.dto';
import { UpdateAssignmentDto } from './dto/updateAssignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
  ) {}

  create(createAssignmentDto: CreateAssignmentDto, userId: number) {
    const assignment = new Assignment();
    assignment.classId = createAssignmentDto.classId;
    assignment.teacherId = userId;
    assignment.title = createAssignmentDto.title;
    assignment.descrption = createAssignmentDto.description;
    assignment.dueDate = createAssignmentDto.dueDate;
    return this.assignmentRepository.save(assignment);
  }

  findAll() {
    return this.assignmentRepository.find({
      select: {
        id: true,
        // classId: true,
        // teacherId: true,
        class: {
          id: true,
          name: true,
        },
        teacher: {
          id: true,
          username: true,
          email: true,
        },
        title: true,
        descrption: true,
        dueDate: true,
      },
      relations: {
        class: true,
        teacher: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} assignment`;
  }

  update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    return `This action updates a #${id} assignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignment`;
  }
}
