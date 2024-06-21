import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/createSubmission.dto';
import { UpdateSubmissionDto } from './dto/updateSubmission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { Repository } from 'typeorm';
import { CreateAssignmentDto } from '../assignments/dto/createAssignment.dto';
import { AttachementsEntityService } from '../attachementsEntity/attachementsEntity.service';
import { CreateAttachementsEntityDto } from '../attachementsEntity/dto/createAttachementsEntity.dto';
import { UploadSubmissionDto } from './dto/uploadSubmission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,

    @Inject(forwardRef(() => AttachementsEntityService))
    private readonly attachementsEntityService: AttachementsEntityService,
  ) {}

  private readonly logger: Logger = new Logger(SubmissionsService.name);
  async create(createSubmissionDto: CreateSubmissionDto, studentId: number) {
    const newSubmission: Submission = new Submission();
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

  async addAttachementMetadata(
    createAttachementsEntityDtos: CreateAttachementsEntityDto[],
    uploadSubmissionDto: UploadSubmissionDto,
    userId: number,
  ) {
    try {
      return await this.attachementsEntityService.createBulkSubmissions(
        createAttachementsEntityDtos,
        uploadSubmissionDto,
        userId,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getAttachementMetadata(attachementId: number) {
    try {
      // return await this.attachementsEntityService.findByAttachmentId(
      //   attachementId,
      // );
      return await this.submissionRepository.findOne({
        where: {
          id: attachementId,
          // attachments: true,
          // attachments: true,
        },
        relations: {
          attachments: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createBulkWithAttachement(submissions: Submission) {
    try {
      return await this.submissionRepository.save(submissions);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return `This action updates a #${id} submission`;
  }

  async remove(id: number) {
    try {
      return await this.submissionRepository.softDelete(id);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async restore(id: number) {
    try {
      return await this.submissionRepository.restore(id);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
