import { Injectable, Logger } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/createAssignment.dto';
import { UpdateAssignmentDto } from './dto/updateAssignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import {
  FindManyOptions,
  NumericType,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateAttachementsEntityDto } from '../attachementsEntity/dto/createAttachementsEntity.dto';
import { AttachementsEntityService } from '../attachementsEntity/attachementsEntity.service';
import { AttachmentsEntity } from '../attachementsEntity/entities/attachementsEntity.entity';
import { UploadAssignmentDto } from './dto/uploadAssignment.dto';
import { UploadSubmissionDto } from '../submissions/dto/uploadSubmission.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,

    private readonly attachementsEntityService: AttachementsEntityService,
  ) {}

  private logger: Logger = new Logger(AssignmentsService.name);
  async create(createAssignmentDto: CreateAssignmentDto, userId: number) {
    const assignment = new Assignment();
    assignment.classId = createAssignmentDto.classId;
    assignment.teacherId = userId;
    assignment.title = createAssignmentDto.title;
    assignment.description = createAssignmentDto.description;
    assignment.dueDate = createAssignmentDto.dueDate;
    return await this.assignmentRepository.save(assignment);
  }

  async addNewAttachementMetadata(
    createAttachementsEntityDtos: CreateAttachementsEntityDto[],
    uploadAssignmentDto: UploadAssignmentDto,
    userId: number,
  ): Promise<Assignment> {
    try {
      return await this.attachementsEntityService.createBulkAssignements(
        createAttachementsEntityDtos,
        uploadAssignmentDto,
        userId,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
  async addAttachementForOldAssignement(
    createAttachementsEntityDtos: CreateAttachementsEntityDto[],
    assignementId: number,
    userId: number,
  ): Promise<Assignment> {
    try {
      return await this.attachementsEntityService.addNewAssignementsAttachement(
        createAttachementsEntityDtos,
        assignementId,
        userId,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getAttachementMetadataByAssignmentId(
    assignementId: number,
  ): Promise<Assignment> {
    try {
      // return await this.attachementsEntityService.findByAttachmentId(
      //   attachementId,
      // );
      return await this.assignmentRepository.findOne({
        where: {
          id: assignementId,
          // attachments: true,
          // attachments: true,
          attachments: {
            attachmentType: 'assignment',
          },
        },
        select: {
          attachments: {
            id: true,
            path: true,
            new_filename: true,
          },
        },
        relations: {
          attachments: true,
          teacher: true,
        },
      });
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
  async findAll(offSet: number = 0, limit: number = 0): Promise<Assignment[]> {
    const options: FindManyOptions<Assignment> = {
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
        description: true,
        dueDate: true,
      },
      relations: {
        class: true,
        teacher: true,
      },
      skip: offSet,
    };
    limit !== 0 && (options.take = limit);

    return await this.assignmentRepository.find(options);
  }
  async countOfRecords(): Promise<number> {
    return await this.assignmentRepository.count();
  }
  async findOne(id: number): Promise<Assignment> {
    return await this.assignmentRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
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
        description: true,
        dueDate: true,
        attachments: {
          path: true,
        },
      },
      relations: {
        class: true,
        teacher: true,
        attachments: true,
      },
    });
  }

  async findWithRelations(id: number): Promise<Assignment> {
    return await this.assignmentRepository.findOne({
      where: {
        id,
      },
      relations: {
        class: true,
        teacher: true,
        attachments: true,
      },
    });
  }

  async update(
    id: number,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<UpdateResult> {
    return await this.assignmentRepository.update(id, updateAssignmentDto);
  }

  async remove(id: number): Promise<UpdateResult> {
    return await this.assignmentRepository.softDelete(id);
  }

  async createBulkWithAttachement(
    assignments: Assignment,
  ): Promise<Assignment> {
    try {
      return await this.assignmentRepository.save(assignments);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async saveAssignment(assignment: Assignment): Promise<Assignment> {
    try {
      return await this.assignmentRepository.save(assignment);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async removeAttachement(id: number): Promise<UpdateResult> {
    try {
      return await this.attachementsEntityService.remove(id);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getAttachementByAttachementId(id: number): Promise<AttachmentsEntity> {
    try {
      return await this.attachementsEntityService.findOneWithRelations(id);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
