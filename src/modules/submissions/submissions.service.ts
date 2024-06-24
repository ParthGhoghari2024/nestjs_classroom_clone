import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/createSubmission.dto';
import { UpdateSubmissionDto } from './dto/updateSubmission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateAssignmentDto } from '../assignments/dto/createAssignment.dto';
import { AttachementsEntityService } from '../attachementsEntity/attachementsEntity.service';
import { CreateAttachementsEntityDto } from '../attachementsEntity/dto/createAttachementsEntity.dto';
import { UploadSubmissionDto } from './dto/uploadSubmission.dto';
import { AttachmentsEntity } from '../attachementsEntity/entities/attachementsEntity.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,

    @Inject(forwardRef(() => AttachementsEntityService))
    private readonly attachementsEntityService: AttachementsEntityService,
  ) {}

  private readonly logger: Logger = new Logger(SubmissionsService.name);
  async create(
    createSubmissionDto: CreateSubmissionDto,
    studentId: number,
  ): Promise<Submission> {
    const newSubmission: Submission = new Submission();
    newSubmission.classId = createSubmissionDto.classId;
    newSubmission.studentId = studentId;
    newSubmission.submission = createSubmissionDto.submission;

    return await this.submissionRepository.save(newSubmission);
  }

  async findAll(): Promise<Submission[]> {
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

  async findOne(id: number): Promise<Submission> {
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
  ): Promise<Submission> {
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

  async getAttachementMetaBySubmssionId(
    SubmissionId: number,
  ): Promise<Submission> {
    try {
      // return await this.attachementsEntityService.findByAttachmentId(
      //   attachementId,
      // );
      return await this.submissionRepository.findOne({
        where: {
          id: SubmissionId,
          // attachments: true,
          // attachments: true,
          attachments: {
            attachmentType: 'submission',
          },
        },
        relations: {
          attachments: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
  async getSubmissionMetaByUserIdSubmussionId(
    userId: number,
    SubmissionId: number,
  ): Promise<Submission> {
    try {
      // return await this.attachementsEntityService.findByAttachmentId(
      //   attachementId,
      // );
      return await this.submissionRepository.findOne({
        where: {
          id: SubmissionId,
          // attachments: true,
          // attachments: true,
          attachments: {
            attachmentType: 'submission',
            userId: userId,
          },
        },
        relations: {
          attachments: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createBulkWithAttachement(
    submissions: Submission,
  ): Promise<Submission> {
    try {
      return await this.submissionRepository.save(submissions);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return `This action updates a #${id} submission`;
  }

  async remove(id: number): Promise<UpdateResult> {
    try {
      return await this.submissionRepository.softDelete(id);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async restore(id: number): Promise<UpdateResult> {
    try {
      return await this.submissionRepository.restore(id);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getAttachementMetadataById(
    attachementId: number,
  ): Promise<AttachmentsEntity> {
    try {
      return await this.attachementsEntityService.findOne(attachementId);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
