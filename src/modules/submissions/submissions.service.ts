import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
  ) {}
  async create(createSubmissionDto: CreateSubmissionDto, studentId: number) {
    const newSubmission = new Submission();
    newSubmission.classId = createSubmissionDto.classId;
    newSubmission.studentId = studentId;
    newSubmission.submission = createSubmissionDto.submission;

    return await this.submissionRepository.save(newSubmission);
  }

  async findAll() {
    return await this.submissionRepository.find({
      select: {
        id: true,
        submission: true,
        createdAt: true,
        student: {
          id: true,
          username: true,
          email: true,
        },
      },
      relations: {
        student: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.submissionRepository.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        submission: true,
        createdAt: true,
        student: {
          id: true,
          username: true,
          email: true,
        },
      },
      relations: {
        student: true,
      },
    });
  }

  update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return `This action updates a #${id} submission`;
  }

  remove(id: number) {
    return `This action removes a #${id} submission`;
  }
}
