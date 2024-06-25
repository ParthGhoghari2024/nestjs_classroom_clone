import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { CreateAttachementsEntityDto } from './dto/createAttachementsEntity.dto';
import { UpdateAttachementsEntityDto } from './dto/updateAttachementsEntity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AttachmentsEntity } from './entities/attachementsEntity.entity';
import { Repository, Transaction } from 'typeorm';
import { Assignment } from '../assignments/entities/assignment.entity';
import { UploadAssignmentDto } from '../assignments/dto/uploadAssignment.dto';
import { UploadSubmissionDto } from '../submissions/dto/uploadSubmission.dto';
import { AssignmentsService } from '../assignments/assignments.service';
import { CreateAssignmentDto } from '../assignments/dto/createAssignment.dto';
import { CreateSubmissionDto } from '../submissions/dto/createSubmission.dto';
import { SubmissionsService } from '../submissions/submissions.service';
import { privateDecrypt } from 'crypto';
import { Submission } from '../submissions/entities/submission.entity';

@Injectable()
export class AttachementsEntityService {
  constructor(
    @InjectRepository(AttachmentsEntity)
    private attachementsService: Repository<AttachmentsEntity>,

    @Inject(forwardRef(() => AssignmentsService))
    private assignmentsService: AssignmentsService,

    @Inject(forwardRef(() => SubmissionsService))
    private submissionsService: SubmissionsService,
  ) {}
  private readonly logger = new Logger(AttachementsEntityService.name);
  async create(createAttachementsEntityDto: CreateAttachementsEntityDto) {
    try {
      return await this.attachementsService.save(createAttachementsEntityDto);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createBulkAssignements(
    createAttachementsEntityDtos: CreateAttachementsEntityDto[],
    uploadAssignmentDto: UploadAssignmentDto,
    userId: number,
  ) {
    try {
      const createAssignmentDto: CreateAssignmentDto =
        new CreateAssignmentDto();
      createAssignmentDto.classId = uploadAssignmentDto.classId;
      createAssignmentDto.description = uploadAssignmentDto.description;
      createAssignmentDto.title = uploadAssignmentDto.title;
      createAssignmentDto.dueDate = uploadAssignmentDto.dueDate;

      const assignment: Assignment = await this.assignmentsService.create(
        createAssignmentDto,
        userId,
      );

      const attachements: AttachmentsEntity[] = [];
      createAttachementsEntityDtos.forEach((attachement) => {
        const newAttach: AttachmentsEntity = new AttachmentsEntity();
        newAttach.attachmentType = attachement.attachmentType;
        newAttach.original_filename = attachement.original_filename;
        newAttach.new_filename = attachement.new_filename;
        newAttach.path = attachement.path;
        newAttach.attachmentId = assignment.id;
        newAttach.userId = userId;
        attachements.push(newAttach);
      });

      assignment.attachments = attachements;

      return await this.assignmentsService.createBulkWithAttachement(
        assignment,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async addNewAssignementsAttachement(
    createAttachementsEntityDtos: CreateAttachementsEntityDto[],
    assignementId: number,
    userId: number,
  ) {
    try {
      const assignment: Assignment =
        await this.assignmentsService.findWithRelations(assignementId);

      const attachements: AttachmentsEntity[] = [];
      createAttachementsEntityDtos.forEach((attachement) => {
        const newAttach: AttachmentsEntity = new AttachmentsEntity();
        newAttach.attachmentType = attachement.attachmentType;
        newAttach.original_filename = attachement.original_filename;
        newAttach.new_filename = attachement.new_filename;
        newAttach.path = attachement.path;
        newAttach.attachmentId = assignment.id;
        newAttach.userId = userId;
        attachements.push(newAttach);
      });

      assignment.attachments = [...assignment.attachments, ...attachements];

      return await this.assignmentsService.saveAssignment(assignment);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createBulkSubmissions(
    createAttachementsEntityDtos: CreateAttachementsEntityDto[],
    uploadSubmissionDto: UploadSubmissionDto,
    userId: number,
  ) {
    try {
      const createSubmissionDto: CreateSubmissionDto =
        new CreateSubmissionDto();
      createSubmissionDto.assignmentId = uploadSubmissionDto.assignmentId; //TODO:
      createSubmissionDto.submission = uploadSubmissionDto.submission;

      const submission: Submission = await this.submissionsService.create(
        createSubmissionDto,
        userId,
      );

      const attachements: AttachmentsEntity[] = [];
      createAttachementsEntityDtos.forEach((attachement) => {
        const newAttach: AttachmentsEntity = new AttachmentsEntity();
        newAttach.attachmentType = attachement.attachmentType;
        newAttach.original_filename = attachement.original_filename;
        newAttach.new_filename = attachement.new_filename;
        newAttach.path = attachement.path;
        newAttach.attachmentId = submission.id;
        newAttach.userId = userId;
        attachements.push(newAttach);
      });

      submission.attachments = attachements;

      return await this.submissionsService.createBulkWithAttachement(
        submission,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  findAll() {
    return `This action returns all attachementsEntity`;
  }

  async findByAttachmentId(id: number) {
    return await this.attachementsService.find({
      where: {
        attachmentId: id,
        // attachmentType: 'assignment',
      },
      select: {
        path: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.attachementsService.findOne({
      where: {
        attachmentId: id,
        attachmentType: 'assignment',
      },
      select: {
        path: true,
        original_filename: true,
        new_filename: true,
      },
    });
  }

  async findOneSubmission(id: number) {
    return await this.attachementsService.findOne({
      where: {
        attachmentId: id,
        attachmentType: 'submission',
      },
      select: {
        path: true,
        original_filename: true,
        new_filename: true,
      },
    });
  }

  async findOneWithRelations(attachementId: number) {
    return await this.attachementsService.findOne({
      where: {
        id: attachementId,
      },
      relations: {
        assignmentAttachment: {},
        submissionAttachment: true,
      },
    });
  }

  update(id: number, updateAttachementsEntityDto: UpdateAttachementsEntityDto) {
    return `This action updates a #${id} attachementsEntity`;
  }

  async remove(id: number) {
    return await this.attachementsService.softDelete(id);
  }
}
